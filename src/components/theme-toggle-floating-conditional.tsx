'use client'

import { usePathname } from 'next/navigation'
import ThemeToggleFloating from './theme-toggle-floating'

export default function ThemeToggleFloatingConditional() {
  const pathname = usePathname()
  
  // Hide theme toggle on /get-started page
  if (pathname === '/get-started') {
    return null
  }
  
  return <ThemeToggleFloating />
}

