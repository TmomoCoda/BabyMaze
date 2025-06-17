import Link from 'next/link';
import { Category } from '../lib/types';

interface Props {
  categories: Category[];
}

export default function CategoryGrid({ categories }: Props) {
  return (
    <section className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12">
      {categories.map(cat => (
        <article key={cat.id} className="bg-white p-4 border rounded" aria-labelledby={`cat-${cat.slug}`}> 
          <h3 id={`cat-${cat.slug}`} className="font-semibold mb-1">{cat.name}</h3>
          <p className="text-sm">{cat.blurb}</p>
          <Link href={`/categories/${cat.slug}`} className="underline">See games</Link>
        </article>
      ))}
    </section>
  );
}
