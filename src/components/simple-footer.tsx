'use client'

import Link from 'next/link'
import { Logo } from '@/app/logo'
import { useTheme } from '@/lib/theme-context'

export default function SimpleFooter() {
  const currentYear = new Date().getFullYear()
  const { resolvedTheme } = useTheme()
  
  // In dark mode, footer uses light background, so use dark logo variant
  const logoVariant = resolvedTheme === 'dark' ? 'dark' : 'primary'

  return (
    <footer className="bg-header-bg text-header-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="mb-3">
              <Logo variant={logoVariant} className="h-8 w-auto" />
            </div>
            <p className="text-header-text/70 text-sm">
              Sri Lanka&apos;s trusted directory of verified wedding professionals. 
              Find your perfect vendors for your special day.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-header-text">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-header-text/70 hover:text-primary hover:opacity-100 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-header-text/70 hover:text-primary hover:opacity-100 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-header-text/70 hover:text-primary hover:opacity-100 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h4 className="font-semibold mb-4 text-header-text">For Vendors</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register" className="text-header-text/70 hover:text-primary hover:opacity-100 transition-colors">
                  Get Listed
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-header-text/70 hover:text-primary hover:opacity-100 transition-colors">
                  Vendor Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-header-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-header-text/70">
            <p>&copy; {currentYear} TieTheKnot. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

