import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { CommentModerationService } from '@/lib/comment-moderation/moderation-service'

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

    const { commentId, action, reason } = await request.json()

    if (!commentId || !action) {
      return NextResponse.json(
        { error: 'Comment ID and action are required' },
        { status: 400 }
      )
    }

    const result = await moderationService.moderateComment(
      commentId,
      action,
      userId,
      reason
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Comment moderation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const pendingComments = await moderationService.getPendingComments()
    return NextResponse.json(pendingComments)
  } catch (error) {
    console.error('Pending comments fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
