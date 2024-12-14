import { prisma } from '@/lib/prisma'
import { commentSchema, commentRateLimiter } from './content-filter'
import { CommentStatus } from '@prisma/client'
import { z } from 'zod'
import { EmailNotificationService } from '@/lib/email/notification-service'

const emailService = new EmailNotificationService()

export class CommentModerationError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'CommentModerationError'
  }
}

interface CreateCommentParams {
  content: string
  articleId: string
  authorId: string
  parentId?: string
}

export class CommentModerationService {
  async createComment(params: CreateCommentParams) {
    // Check rate limit
    if (!commentRateLimiter.canComment(params.authorId)) {
      const timeToWait = commentRateLimiter.getTimeToWait(params.authorId)
      throw new CommentModerationError(
        `Please wait ${Math.ceil(timeToWait / 1000)} seconds before commenting again`,
        'RATE_LIMIT_EXCEEDED'
      )
    }

    // Validate content
    try {
      await commentSchema.parseAsync({ content: params.content })
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new CommentModerationError(
          error.errors[0].message,
          'CONTENT_VALIDATION_FAILED'
        )
      }
      throw error
    }

    // Create comment with PENDING status
    const comment = await prisma.blogComment.create({
      data: {
        ...params,
        status: CommentStatus.PENDING
      }
    })

    // If it's a reply, send notification to parent comment author
    if (params.parentId) {
      const parentComment = await prisma.blogComment.findUnique({
        where: { id: params.parentId }
      })
      if (parentComment) {
        await emailService.sendCommentReplyNotification(comment, parentComment)
      }
    }

    return comment
  }

  async moderateComment(
    commentId: string,
    action: 'APPROVE' | 'REJECT' | 'MARK_SPAM',
    moderatorId: string,
    reason?: string
  ) {
    const status = this.getStatusFromAction(action)

    const [comment, moderation] = await prisma.$transaction([
      // Update comment status
      prisma.blogComment.update({
        where: { id: commentId },
        data: {
          status,
          moderatedAt: new Date()
        }
      }),
      // Create moderation record
      prisma.commentModeration.create({
        data: {
          commentId,
          action,
          moderatorId,
          reason
        }
      })
    ])

    // Send email notification about moderation result
    await emailService.sendModerationUpdateNotification(comment, status)

    return { comment, moderation }
  }

  private getStatusFromAction(action: string): CommentStatus {
    switch (action) {
      case 'APPROVE':
        return CommentStatus.APPROVED
      case 'REJECT':
        return CommentStatus.REJECTED
      case 'MARK_SPAM':
        return CommentStatus.SPAM
      default:
        throw new CommentModerationError(
          'Invalid moderation action',
          'INVALID_ACTION'
        )
    }
  }

  async getCommentWithModeration(commentId: string) {
    return prisma.blogComment.findUnique({
      where: { id: commentId },
      include: {
        replies: true
      }
    })
  }

  async getPendingComments() {
    return prisma.blogComment.findMany({
      where: { status: CommentStatus.PENDING },
      orderBy: { createdAt: 'asc' }
    })
  }

  async getArticleComments(articleId: string) {
    return prisma.blogComment.findMany({
      where: {
        articleId,
        status: CommentStatus.APPROVED,
        parentId: null // Get only top-level comments
      },
      include: {
        replies: {
          where: { status: CommentStatus.APPROVED },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}
