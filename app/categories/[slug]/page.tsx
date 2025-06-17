import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Category } from '../../../lib/types';

async function getCategory(slug: string): Promise<Category | null> {
  return null; // TODO fetch from CMS
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cat = await getCategory(params.slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.blurb.slice(0, 150)
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = await getCategory(params.slug);
  if (!cat) notFound();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{cat.name}</h1>
      <p>{cat.blurb}</p>
      {/* TODO: list games in this category */}
    </div>
  );
}
