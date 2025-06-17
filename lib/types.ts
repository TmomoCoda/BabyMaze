export interface RatingAggregate {
  look: number;
  playability: number;
  creativity: number;
  overall: number;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  coverUrl: string;
  plays: number;
  ratings: RatingAggregate;
}

export interface User {
  id: string;
  handle: string;
  avatarUrl?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  blurb: string;
}
