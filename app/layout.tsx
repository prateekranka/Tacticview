import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'TacticView',
  description:
    'Live football tactical companion — formations, events, and AI analysis',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'TacticView',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [{ url: '/icons/icon-192.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icons/apple-touch-icon.svg', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#22c55e',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-tv-bg text-tv-text antialiased"
        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      >
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 border-b border-tv-border bg-tv-bg/90 backdrop-blur-sm safe-area-top">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-tv-accent">
                TacticView
              </span>
              <span className="hidden text-xs text-tv-text-muted sm:inline">
                Tactical Companion
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-tv-text-muted">
              <Link
                href="/"
                className="transition-colors hover:text-tv-text"
              >
                Competitions
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

        {/* Footer */}
        <footer className="border-t border-tv-border py-6 text-center text-xs text-tv-text-muted safe-area-bottom">
          <p>
            Powered by{' '}
            <a
              href="https://www.football-data.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tv-accent transition-colors hover:underline"
            >
              football-data.org
            </a>{' '}
            &amp;{' '}
            <a
              href="https://www.anthropic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tv-accent transition-colors hover:underline"
            >
              Claude
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
