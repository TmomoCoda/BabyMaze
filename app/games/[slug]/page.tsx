import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Game } from '../../../lib/types';

// TODO: fetch from CMS
async function getGame(slug: string): Promise<Game | null> {
  return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const game = await getGame(params.slug);
  if (!game) return {};
  return {
    title: game.title,
    description: `${game.title} is a free web game. Play now!`
  };
}

export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await getGame(params.slug);
  if (!game) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    image: game.coverUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: game.ratings.overall,
      ratingCount: game.plays,
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{game.title}</h1>
      <div className="aspect-video bg-black mb-4">{/* iframe/canvas here */}</div>
      <p>Plays: {game.plays}</p>
      <Script id="game-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
