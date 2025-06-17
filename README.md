# FreeGames4Eva

Next.js 15 (App Router) project for the FreeGames4Eva platform. This skeleton sets up TailwindCSS, basic SEO utilities and testing helpers.

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env.local` based on `.env.example` before running in production.

### Deployment

The project is optimised for [Vercel](https://vercel.com). Push the repo, connect to Vercel and set environment variables. SSR caches may be configured via the `revalidate` prop in page components.

### Testing

```bash
npm test
```

Lighthouse CI runs in GitHub Actions to ensure SEO and PWA scores remain high.
