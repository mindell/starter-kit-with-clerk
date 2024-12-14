import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { CommentModerationService, CommentModerationError } from '@/lib/comment-moderation/moderation-service'

const moderationService = new CommentModerationService()

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { content, articleId, parentId } = await request.json()

    const comment = await moderationService.createComment({
      content,
      articleId,
      authorId: userId,
      parentId
    })

    return NextResponse.json(comment)
  } catch (error) {
    if (error instanceof CommentModerationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    console.error('Comment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get('articleId')

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    const comments = await moderationService.getArticleComments(articleId)
    return NextResponse.json(comments)
  } catch (error) {
    console.error('Comment fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
