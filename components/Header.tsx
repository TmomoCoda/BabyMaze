import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
      <Link href="/" className="text-lg font-bold">FreeGames4Eva</Link>
      <div className="flex-1 mx-4">
        {/* TODO: replace with algolia search */}
        <input type="search" placeholder="Search games" className="w-full px-2 py-1 rounded text-black" />
      </div>
      <Link href="/login" className="underline">Sign In</Link>
    </header>
  );
}
