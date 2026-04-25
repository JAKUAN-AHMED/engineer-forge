import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Engineer Forge — Train to L1',
  description:
    'Industry-grade training platform that transforms learners into Software Engineer L1 through a curriculum of JavaScript, TypeScript, Node.js, system design, and CS fundamentals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
