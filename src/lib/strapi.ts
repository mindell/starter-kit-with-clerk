interface StrapiResponse<T> {
  data: {
    id: number;
    attributes: T;
  };
  meta: any;
}

interface AboutContent {
  title: string;
  content: string;
  updatedAt: string;
}

export async function fetchFromStrapi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    ...options,
  };

  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api${endpoint}`;
  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const response = await fetchFromStrapi<StrapiResponse<AboutContent>>('/about');
    return response.data.attributes;
  } catch (error) {
    console.error('Error fetching about content:', error);
    return {
      title: 'About Us',
      content: 'Content temporarily unavailable',
      updatedAt: new Date().toISOString(),
    };
  }
}
