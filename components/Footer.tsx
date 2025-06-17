export default function Footer() {
  return (
    <footer className="bg-gray-100 p-4 text-sm text-center mt-8" role="contentinfo">
      <p>&copy; {new Date().getFullYear()} FreeGames4Eva</p>
      <nav className="mt-2" aria-label="footer">
        <a href="/sitemap.xml" className="mx-2 underline">Sitemap</a>
        <a href="/legal" className="mx-2 underline">Legal</a>
      </nav>
    </footer>
  );
}
