# FreeGames4Eva

Next.js 15 (App Router) project for the FreeGames4Eva platform. This skeleton sets up TailwindCSS, basic SEO utilities and testing helpers.

## Getting Started

Simply open `index.html` in your browser. For local development you can also
serve the repository with a small static server:

```bash
npx http-server .
```

### Testing

```bash
npm test
```

Lighthouse CI runs in GitHub Actions to ensure SEO and PWA scores remain high.

### Assets

Static files live in the `public/` directory. The service worker at
`public/sw.js` caches navigation requests for offline access. When modifying its
behaviour or updating asset filenames, update the `CACHE` name inside the file
so browsers fetch the latest version. Other files such as `public/robots.txt`
can be edited directly.
