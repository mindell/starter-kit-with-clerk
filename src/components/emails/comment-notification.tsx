import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

interface CommentNotificationEmailProps {
  authorName: string
  commentContent: string
  articleTitle: string
  articleUrl: string
  type: 'new_comment' | 'reply' | 'moderation_update'
  status?: 'approved' | 'rejected' | 'spam'
}

export default function CommentNotificationEmail({
  authorName,
  commentContent,
  articleTitle,
  articleUrl,
  type,
  status,
}: CommentNotificationEmailProps) {
  const getSubject = () => {
    switch (type) {
      case 'new_comment':
        return 'New comment on your article'
      case 'reply':
        return 'Someone replied to your comment'
      case 'moderation_update':
        return `Your comment has been ${status}`
      default:
        return 'Comment notification'
    }
  }

  const getMessage = () => {
    switch (type) {
      case 'new_comment':
        return `${authorName} commented on your article "${articleTitle}"`
      case 'reply':
        return `${authorName} replied to your comment on "${articleTitle}"`
      case 'moderation_update':
        return `Your comment on "${articleTitle}" has been ${status}`
      default:
        return ''
    }
  }

  return (
    <Html>
      <Head />
      <Preview>{getSubject()}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 px-4">
            <Heading className="text-2xl font-bold text-gray-800 mb-4">
              {getSubject()}
            </Heading>
            <Text className="text-gray-700 mb-4">{getMessage()}</Text>
            {commentContent && (
              <Container className="bg-gray-50 p-4 rounded-lg mb-4">
                <Text className="text-gray-600 italic">"{commentContent}"</Text>
              </Container>
            )}
            <Container className="mt-8">
              <Link
                href={articleUrl}
                className="bg-blue-500 text-white px-6 py-3 rounded-md font-medium"
              >
                View {type === 'reply' ? 'Reply' : 'Comment'}
              </Link>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
