import CategoryGrid from '../components/CategoryGrid';
import { Category } from '../lib/types';

async function getCategories(): Promise<Category[]> {
  return [
    { id: '1', slug: 'maze', name: 'Maze', blurb: 'Time-boxed labyrinths; collect keys, beat the clock.' },
    // TODO: fetch from CMS
  ];
}

export const revalidate = 60; // SSG

export default async function HomePage() {
  const categories = await getCategories();
  return (
    <div className="p-4">
      <section className="text-center mb-6">
        <h2 className="text-xl font-semibold">Browse 20 000+ free games</h2>
        <p>Ready? Dive into today’s Hot 10 ↓</p>
      </section>
      <CategoryGrid categories={categories} />
    </div>
  );
}
