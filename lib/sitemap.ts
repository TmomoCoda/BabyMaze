import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://freegames4eva.com/', lastModified: new Date() },
    // TODO: fetch slugs
  ];
}
