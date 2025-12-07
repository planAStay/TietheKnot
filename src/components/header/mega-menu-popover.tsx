'use client'

import { TCollection } from '@/data'
import { TImage } from '@/type'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import CollectionCard from '../collection-card'
import { Text, TextLink } from '../text'

export interface MegaMenuPopoverProps {
  megamenu: { name: string; href: string; chidren: { name: string; href: string }[] }[]
  children: React.ReactNode | string
  rightImage?: TImage
  featuredCollections?: TCollection[]
  variant?: 'right-collection' | 'right-image'
}

const MegaMenuPopover = ({
  megamenu,
  children,
  rightImage,
  featuredCollections,
  variant = 'right-collection',
}: MegaMenuPopoverProps) => {
  return (
    <Popover>
      <PopoverButton className="flex cursor-pointer items-center gap-x-0.5 focus-visible:outline-0">
        <Text>{children}</Text>
        <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1} />
      </PopoverButton>

      <PopoverPanel
        transition
        className="bitpan-popover-full-panel absolute inset-x-0 top-0 -z-10 bg-white pt-[5.1rem] text-zinc-950 shadow-xl transition data-closed:-translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-zinc-800 dark:text-zinc-100"
      >
        <div className="flex justify-between gap-x-8 px-8 py-10 2xl:container dark:border-white/10">
          <div className="flex max-w-xl flex-wrap gap-x-[clamp(1.5rem,5vw,5rem)] gap-y-8">
            {megamenu.map((group) => {
              return (
                <div key={group.name}>
                  <Text className="text-sm/6 font-medium">{group.name}</Text>
                  <ul role="list" className="mt-5 space-y-2.5">
                    {group.chidren.map((item, index) => (
                      <li key={index}>
                        <TextLink
                          href={item.href}
                          className="text-sm/6 text-zinc-600 uppercase hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                        >
                          {item.name}
                        </TextLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Featured Collections */}
          {variant === 'right-collection' && featuredCollections ? (
            <div className="flex max-w-3/5 grow justify-end">
              <div className="flex gap-3 overflow-x-auto overflow-y-hidden">
                {featuredCollections?.map((collection) => (
                  <div className="w-60 shrink-0" key={collection.id}>
                    <CollectionCard collection={collection} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* OR Featrued Image */}
          {variant === 'right-image' && rightImage ? (
            <div className="w-1/3 ps-8">
              <div className="relative aspect-16/9 w-full">
                <Image
                  src={rightImage?.src || '/images/hijab/feature-1-2.png'}
                  alt={rightImage?.alt || 'Featured product'}
                  fill
                  className="h-auto w-full object-cover object-top"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280) 50vw, 35vw"
                />
              </div>
            </div>
          ) : null}
        </div>
      </PopoverPanel>
    </Popover>
  )
}

export default MegaMenuPopover
