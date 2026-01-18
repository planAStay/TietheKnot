'use client'

import { usePathname } from 'next/navigation'
import { AuthLayout } from './auth-layout'

export function ConditionalAuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Only vendor-dashboard needs full width, exclude it from AuthLayout
  // vendor-profile and vendor-questions work fine with AuthLayout's centered layout
  const isVendorDashboard = pathname === '/vendor-dashboard'
  
  if (isVendorDashboard) {
    return <main className="flex-1 bg-background">{children}</main>
  }
  
  return <AuthLayout>{children}</AuthLayout>
}

