import Aside from '@/components/aside'
import ThemeToggleFloatingConditional from '@/components/theme-toggle-floating-conditional'
import '@/styles/tailwind.css'
import { WeddingProvider } from '@/lib/wedding-context'
import { WeddingInfoProvider } from '@/lib/wedding-info-context'
import { ThemeProvider, themeScript } from '@/lib/theme-context'
import { AuthProvider } from '@/lib/auth-context'
import NextTopLoader from 'nextjs-toploader'
import clsx from 'clsx'
import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'

const dm_sans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  variable: '--font-dm-sans',
})
const playfair_display = Playfair_Display({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  style: 'italic',
  variable: '--font-playfair-display',
})

export const metadata: Metadata = {
  title: {
    template: '%s - TieTheKnot',
    default: 'TieTheKnot',
  },
  description:
    'TieTheKnot is a modern wedding planner experience: explore vendors, save shortlist, set your date, and request quotes.',
  keywords: [
    'Next.js',
    'Wedding Planner',
    'Tailwind CSS',
    'Vendors',
    'Quotes',
    'Shortlist',
    'Wedding',
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={clsx(
        'antialiased',
        dm_sans.variable,
        playfair_display.variable
      )}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background text-text transition-colors duration-300">
        <NextTopLoader
          color="#E87567"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #E87567,0 0 5px #E87567"
        />
        <ThemeProvider>
          <AuthProvider>
            <Aside.Provider>
              <WeddingProvider>{children}</WeddingProvider>
            </Aside.Provider>
            <ThemeToggleFloatingConditional />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
