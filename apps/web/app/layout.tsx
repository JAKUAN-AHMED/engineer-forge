import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Engineer Forge — Train to L1',
  description:
    'Industry-grade training platform that transforms learners into Software Engineer L1 through a curriculum of JavaScript, TypeScript, Node.js, system design, and CS fundamentals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b border-gray-300 bg-white backdrop-blur sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-black hover:text-blue-600">
              <span className="text-blue-600">⬢</span> Engineer Forge
            </Link>
            <div className="flex items-center gap-5 text-sm text-gray-700">
              <Link href="/courses">Courses</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        <footer className="border-t border-gray-300 mt-20 py-8 text-center text-sm text-gray-500">
          Engineer Forge · built for real engineers ·{' '}
          <a href="https://github.com/JAKUAN-AHMED/engineer-forge">source</a>
        </footer>
      </body>
    </html>
  );
}
