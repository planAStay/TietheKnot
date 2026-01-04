'use client'

import { useState } from 'react'

import { getVendorCategories } from '@/data-wedding'
import Aside from './aside'
import { Heading } from './heading'
import { TextLink } from './text'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

const categories = getVendorCategories()

export default function AsideSidebarCategories() {
  const [openId, setOpenId] = useState<string | null>(categories[0]?.id ?? null)

  return (
    <Aside
      openFrom="left"
      type="categories-panel"
      contentMaxWidthClassName="max-w-md"
      heading="Categories"
      logoOnHeading={false}
    >
      <div className="h-full overflow-y-auto py-6">
        {/* Main list with expandable subcategories */}
        <div className="space-y-1">
          {categories.map((cat, idx) => {
            const isOpen = openId === cat.id
            return (
              <div key={cat.id} className="rounded-md bg-white">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : cat.id)}
                  aria-expanded={isOpen}
                  className={clsx(
                    'group flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-lg font-semibold uppercase transition',
                    'hover:bg-blush/50',
                    'text-text'
                  )}
                >
                  <span>{cat.name}</span>
                  <ChevronRightIcon
                    className={clsx(
                      'h-5 w-5 text-primary transition-transform',
                      isOpen ? 'rotate-90' : 'rotate-0'
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="mb-2 ml-3 space-y-1 border-l border-primary/30 pl-3">
                    {cat.subcategories.map((sub) => (
                      <TextLink
                        key={sub.id}
                        href={`/collections/${cat.slug}?subcategory=${sub.slug}`}
                        className="block rounded-md px-2 py-1 text-sm font-medium capitalize text-zinc-700 hover:bg-blush/50 hover:text-primary"
                      >
                        {sub.name}
                      </TextLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-5 rounded-md border border-primary/30 bg-white p-4 text-sm text-text shadow-sm">
          <TextLink href="/collections/all" className="font-semibold text-accent">
            See all categories
          </TextLink>
        </div>
      </div>
    </Aside>
  )
}

