import '@/styles/tailwind.css'
import '@fontsource/diphylleia'
import { AuthProvider } from '@/lib/auth-context'
import NextTopLoader from 'nextjs-toploader'
import type { Metadata } from 'next'
import Aside from '@/components/aside'
import { WeddingProvider } from '@/lib/wedding-context'
import { ThemeProvider } from '@/lib/theme-context'
import { ConfirmDialogProvider } from '@/components/confirm-dialog'

export const metadata: Metadata = {
  title: {
    template: '%s - TieTheKnot',
    default: 'TieTheKnot - Find Your Perfect Wedding Vendors in Sri Lanka',
  },
  description:
    'Discover and connect with verified wedding vendors in Sri Lanka. Browse photographers, venues, caterers, and more for your special day.',
  keywords: [
    'Wedding Vendors Sri Lanka',
    'Wedding Planning',
    'Sri Lankan Weddings',
    'Wedding Directory',
    'Wedding Marketplace',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tietheknot.lk',
    siteName: 'TieTheKnot',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="antialiased"
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical font */}
        <link
          rel="preload"
          href="/node_modules/@fontsource/diphylleia/files/diphylleia-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background text-text transition-colors duration-300">
        <NextTopLoader
          color="#F5B5A9"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #F5B5A9,0 0 5px #F5B5A9"
        />
        <ThemeProvider>
          <AuthProvider>
            <Aside.Provider>
              <WeddingProvider>
                <ConfirmDialogProvider>
                  {children}
                </ConfirmDialogProvider>
              </WeddingProvider>
            </Aside.Provider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
