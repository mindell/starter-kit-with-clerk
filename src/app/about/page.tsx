import { getAboutContent } from '@/lib/strapi';
import Header from '../components/Header';

export const revalidate = 3600; // Revalidate every hour

export default async function AboutPage() {
  const aboutContent = await getAboutContent();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-indigo-600 mb-8">
            {aboutContent.title}
          </h1>
          
          <div className="prose prose-lg max-w-none prose-indigo">
            <div dangerouslySetInnerHTML={{ __html: aboutContent.content }} />
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            Last updated: {new Date(aboutContent.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </main>
    </div>
  );
}
