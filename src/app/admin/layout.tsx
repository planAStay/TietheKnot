'use client'

import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Logo } from '@/app/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Heading } from '@/components/heading'
import { ApplicationLayout } from '@/app/(shop)/application-layout'
import { 
  Squares2X2Icon, 
  UsersIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { resolvedTheme } = useTheme()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
    router.refresh()
  }

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.roles?.includes('ADMIN'))) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <ApplicationLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      </ApplicationLayout>
    )
  }

  if (!isAuthenticated || !user?.roles?.includes('ADMIN')) {
    return null
  }

  // In dark mode, header uses light background, so use dark logo variant
  const logoVariant = resolvedTheme === 'dark' ? 'dark' : 'primary'

  // Custom admin header to replace the default one
  const adminHeader = (
    <header className="bg-header-bg border-b border-header-border sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Logo variant={logoVariant} className="h-8 w-auto" />
              <span className="text-lg font-semibold text-header-text hidden sm:inline">Admin</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-header-text/80 hover:text-header-text transition-colors"
              >
                <Squares2X2Icon className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/vendors/pending"
                className="flex items-center gap-2 text-sm font-medium text-header-text/80 hover:text-header-text transition-colors"
              >
                <UsersIcon className="h-4 w-4" />
                Pending Vendors
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm text-header-text/70">
              {user.name} ({user.email})
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-header-text/70 hover:text-primary transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )

  return (
    <ApplicationLayout header={adminHeader}>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </ApplicationLayout>
  )
}

