import { Resend } from 'resend'
import { CommentStatus } from '@prisma/client'
import CommentNotificationEmail from '@/components/emails/comment-notification'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

export class EmailNotificationService {
  private async getUserEmail(userId: string): Promise<string | null> {
    // Implement based on your user management system (Clerk)
    // This is a placeholder
    return 'user@example.com'
  }

  private async getArticleDetails(articleId: string) {
    // Fetch from Strapi
    // This is a placeholder
    return {
      title: 'Article Title',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/category/article-slug`
    }
  }

  async sendNewCommentNotification(comment: any) {
    try {
      const [authorEmail, articleDetails] = await Promise.all([
        this.getUserEmail(comment.authorId),
        this.getArticleDetails(comment.articleId)
      ])

      if (!authorEmail) {
        console.error('Author email not found')
        return
      }

      await resend.emails.send({
        from: 'Blog Notifications <notifications@yourdomain.com>',
        to: authorEmail,
        subject: 'New comment on your article',
        react: CommentNotificationEmail({
          type: 'new_comment',
          authorName: 'Author Name', // Get from user profile
          commentContent: comment.content,
          articleTitle: articleDetails.title,
          articleUrl: articleDetails.url
        })
      })

      // Update notification status
      await prisma.blogComment.update({
        where: { id: comment.id },
        data: { isNotified: true }
      })
    } catch (error) {
      console.error('Failed to send new comment notification:', error)
    }
  }

  async sendCommentReplyNotification(reply: any, parentComment: any) {
    try {
      const [authorEmail, articleDetails] = await Promise.all([
        this.getUserEmail(parentComment.authorId),
        this.getArticleDetails(reply.articleId)
      ])

      if (!authorEmail) {
        console.error('Parent comment author email not found')
        return
      }

      await resend.emails.send({
        from: 'Blog Notifications <notifications@yourdomain.com>',
        to: authorEmail,
        subject: 'New reply to your comment',
        react: CommentNotificationEmail({
          type: 'reply',
          authorName: 'Reply Author Name', // Get from user profile
          commentContent: reply.content,
          articleTitle: articleDetails.title,
          articleUrl: articleDetails.url
        })
      })

      await prisma.blogComment.update({
        where: { id: reply.id },
        data: { isNotified: true }
      })
    } catch (error) {
      console.error('Failed to send reply notification:', error)
    }
  }

  async sendModerationUpdateNotification(comment: any, status: CommentStatus) {
    try {
      const [authorEmail, articleDetails] = await Promise.all([
        this.getUserEmail(comment.authorId),
        this.getArticleDetails(comment.articleId)
      ])

      if (!authorEmail) {
        console.error('Comment author email not found')
        return
      }

      await resend.emails.send({
        from: 'Blog Notifications <notifications@yourdomain.com>',
        to: authorEmail,
        subject: `Your comment has been ${status.toLowerCase()}`,
        react: CommentNotificationEmail({
          type: 'moderation_update',
          authorName: 'Author Name', // Get from user profile
          commentContent: comment.content,
          articleTitle: articleDetails.title,
          articleUrl: articleDetails.url,
          status: status.toLowerCase() as any
        })
      })
    } catch (error) {
      console.error('Failed to send moderation update notification:', error)
    }
  }
}
