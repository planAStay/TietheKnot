'use client'

import { useAside } from '@/components/aside'
import { Bars3Icon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export default function CategoriesToggle({ className = '' }: { className?: string }) {
  const { open } = useAside()
  return (
    <button
      type="button"
      onClick={() => open('categories-panel')}
      className={clsx(
        'flex flex-col gap-1.5 rounded-md p-2 transition hover:bg-zinc-100',
        className
      )}
      aria-label="Open vendor categories"
    >
      <span className="h-0.5 w-6 bg-zinc-900" />
      <span className="h-0.5 w-6 bg-zinc-900" />
      <span className="h-0.5 w-6 bg-zinc-900" />
    </button>
  )
}

