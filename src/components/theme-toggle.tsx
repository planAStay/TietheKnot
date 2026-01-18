'use client'

import { useTheme } from '@/lib/theme-context'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme()
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-header-bg/5 transition-colors"
      aria-label="Toggle theme"
      title={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {resolvedTheme === 'light' ? (
        <MoonIcon className="h-5 w-5 text-header-text/80 hover:text-header-text" />
      ) : (
        <SunIcon className="h-5 w-5 text-header-text/80 hover:text-header-text" />
      )}
    </button>
  )
}
