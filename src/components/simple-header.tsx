'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { Button } from './button'
import { Logo } from '@/app/logo'
import { ThemeToggle } from './theme-toggle'
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function SimpleHeader() {
  const { user, isAuthenticated, logout } = useAuth()
  const { resolvedTheme } = useTheme()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  // In dark mode, header uses light background, so use dark logo variant
  const logoVariant = resolvedTheme === 'dark' ? 'dark' : 'primary'

  return (
    <header className="sticky top-0 z-50 bg-header-bg border-b border-header-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo priority variant={logoVariant} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-header-text/80 hover:text-header-text transition-colors"
            >
              Home
            </Link>
            <ThemeToggle />
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button plain className="text-sm text-header-text hover:bg-header-bg/5">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button color="accent" className="text-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-header-text/80 hover:text-header-text transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  {user?.name || 'Account'}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-elevated rounded-lg shadow-lg border border-header-border py-2">
                    {user?.roles?.includes('ADMIN') && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-text/80 hover:bg-header-bg/5 hover:text-text"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {user?.roles?.includes('VENDOR') && (
                      <Link
                        href="/vendor-dashboard"
                        className="block px-4 py-2 text-sm text-text/80 hover:bg-header-bg/5 hover:text-text"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Vendor Dashboard
                      </Link>
                    )}
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-text/80 hover:bg-header-bg/5 hover:text-text"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <div className="border-t border-zinc-200 dark:border-zinc-700 my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-header-bg/5 w-full text-left"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-header-text/80"
          >
            {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-header-border py-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-header-text/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button plain className="w-full text-header-text hover:bg-header-bg/5">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button color="accent" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {user?.roles?.includes('ADMIN') && (
                    <Link
                      href="/admin/dashboard"
                      className="text-sm font-medium text-header-text/80"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user?.roles?.includes('VENDOR') && (
                    <Link
                      href="/vendor-dashboard"
                      className="text-sm font-medium text-header-text/80"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Vendor Dashboard
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className="text-sm font-medium text-header-text/80"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <Button 
                    onClick={handleLogout}
                    outline
                    className="w-full border-header-border text-primary hover:bg-header-bg/10"
                  >
                    Logout
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

