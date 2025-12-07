import Aside from '@/components/aside'
import '@/styles/tailwind.css'
import { WeddingProvider } from '@/lib/wedding-context'
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
    'TieTheKnot is a modern wedding planner experience: explore vendors, save favorites, set your date, and request quotes.',
  keywords: [
    'Next.js',
    'Wedding Planner',
    'Tailwind CSS',
    'Vendors',
    'Quotes',
    'Favorites',
    'Wedding',
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={clsx(
        'antialiased bg-[var(--color-background)] text-[var(--color-text)] dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950',
        dm_sans.variable,
        playfair_display.variable
      )}
    >
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
        <Aside.Provider>
          <WeddingProvider>{children}</WeddingProvider>
        </Aside.Provider>
      </body>
    </html>
  )
}
