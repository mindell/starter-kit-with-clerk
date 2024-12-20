import { Metadata } from 'next'

interface DynamicMetadataProps {
  title: string
  description?: string
  publishedAt?: string
  type?: 'article' | 'website' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other'
  image?: string
  slug?: string
  author?: string
}

export function generateDynamicMetadata({
  title,
  description,
  publishedAt,
  type = 'article',
  image,
  slug,
  author,
}: DynamicMetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type,
      ...(image && { images: [{ url: image }] }),
      url: `${baseUrl}/${slug || ''}`,
      publishedTime: publishedAt,
      modifiedTime: publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image && { images: [image] }),
    },
    alternates: {
      canonical: `${baseUrl}/${slug || ''}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    authors: [{ name: author ? author : `${process.env.NEXT_PUBLIC_APP_NAME} Team` }],
    ...(publishedAt && {
      other: {
        'article:published_time': publishedAt,
        'article:modified_time': publishedAt,
      },
    }),
  }
}
