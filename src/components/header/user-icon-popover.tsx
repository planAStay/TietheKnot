'use client'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import {
  FavouriteIcon,
  Logout01Icon,
  Settings03Icon,
  ShoppingBasket01Icon,
  UserCircleIcon,
  UserListIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Text, TextLink } from '../text'

const userMenu = [
  { name: 'My account', href: '/orders', icon: UserListIcon },
  { name: 'Account settings', href: '/settings', icon: Settings03Icon },
  { name: 'Orders', href: '/orders/4657', icon: ShoppingBasket01Icon },
  { name: 'Wishlist', href: '/collections/all', icon: FavouriteIcon },
  { name: 'Sign out', href: '#', icon: Logout01Icon },
]

export interface UserIconPopoverProps {}

const UserIconPopover = ({}: UserIconPopoverProps) => {
  return (
    <Popover className="relative">
      <PopoverButton className="-m-2.5 flex cursor-pointer items-center justify-center p-2.5 focus-visible:outline-0">
        <HugeiconsIcon icon={UserCircleIcon} size={24} color="currentColor" strokeWidth={1} />
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute top-full -right-5 -z-10 mt-6 flex w-56 flex-col gap-y-0.5 bg-white px-2.5 pt-6 pb-5 text-zinc-950 shadow-lg transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in dark:bg-zinc-800 dark:text-zinc-100"
      >
        {userMenu.map((item) => (
          <TextLink
            href={item.href}
            key={item.name}
            className="flex items-center gap-x-3.5 px-2 py-2 hover:bg-zinc-50 sm:gap-x-5 sm:px-3 dark:hover:bg-zinc-900"
          >
            <HugeiconsIcon icon={item.icon} size={20} color="currentColor" strokeWidth={1} />
            <Text>{item.name}</Text>
          </TextLink>
        ))}
      </PopoverPanel>
    </Popover>
  )
}

export default UserIconPopover
