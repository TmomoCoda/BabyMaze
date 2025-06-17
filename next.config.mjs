/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  images: {
    domains: ['example.com'] // TODO: add CDN domain
  },
};
export default nextConfig;
