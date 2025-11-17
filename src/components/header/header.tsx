import { Logo } from '@/app/logo'
import { getSkincareCollections } from '@/data'
import clsx from 'clsx'
import Link from 'next/link'
import { TextLink } from '../text'
import CartIconBtn from './cart-icon-btn'
import DropdownMenuPopover from './dropdown-menu-popover'
import HamburgerIconMenu from './hamburger-icon-menu'
import MegaMenuPopover, { MegaMenuPopoverProps } from './mega-menu-popover'
import SearchIconPopover from './search-icon-popover'
import UserIconPopover from './user-icon-popover'

const demo_pages_menu = [
  { name: 'Home skincare', href: '/' },
  { name: 'Home fashion', href: '/home-fashion' },
  { name: 'Home hjiab', href: '/home-hjiab' },
  { name: 'Coming soon', href: '#' },
]
const mega_menus = [
  {
    name: 'Demo pages',
    href: '#',
    chidren: demo_pages_menu,
  },
  {
    name: 'Collections',
    href: '#',
    chidren: [
      { name: 'All collections 1', href: '/collections/all' },
      { name: 'All collections 2', href: '/collections/page-style-2/all' },
      { name: 'Collection page', href: '/collections/face-wash' },
      { name: 'Product Detail', href: '/products/hydrating-sheet-mask' },
      { name: 'Product Detail 2', href: '/products/page-style-3/leather-tote-bag' },
      { name: 'Product Detail 3', href: '/products/page-style-2/printed-chiffon-hijab' },
    ],
  },
  {
    name: "What's new",
    href: '#',
    chidren: [
      { name: 'Contact us', href: '/contact' },
      { name: 'About us', href: '/about-us' },
      { name: 'Journal / Blog', href: '/blog' },
      { name: 'Login / Sign up', href: '/login' },
      { name: 'Shopping Cart', href: '/cart' },
      { name: 'Orders', href: '/orders' },
    ],
  },
]

const demo_checkout_menu = [
  { name: 'Login / Sign up', href: '/login' },
  { name: 'Cart', href: '/cart' },
  { name: 'Checkout', href: '/checkout' },
  { name: 'Order successful', href: '/order-successful' },
  { name: 'Orders', href: '/orders' },
  { name: 'Orders Detail', href: '/orders/4657' },
]

interface HeaderProps {
  className?: string
  hasBottomBorder?: boolean
  variant?: 'default' | 'bg-transparent-text-white'
  megamenuVariant?: MegaMenuPopoverProps['variant']
}

const Header = async ({ className, hasBottomBorder = true, variant = 'default', megamenuVariant }: HeaderProps) => {
  const collections = await getSkincareCollections()
  const featuredCollections = collections.slice(0, 3) // Get 3 collections

  return (
    <header
      className={clsx(
        className,
        'group z-10 w-full',
        variant === 'default' && 'relative',
        variant === 'bg-transparent-text-white' &&
          'absolute inset-x-0 top-0 bg-transparent text-white transition-colors duration-300 has-[.bitpan-popover-full-panel]:text-zinc-950'
      )}
    >
      <nav aria-label="Global" className="container">
        <div
          className={clsx(
            'flex items-center justify-between border-zinc-950/10 py-6 dark:border-white/10',
            hasBottomBorder && 'border-b',
            !hasBottomBorder && 'has-[.bitpan-popover-full-panel]:border-b'
          )}
        >
          {/* LEFT LOGO */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Logo />
            </Link>
          </div>

          {/* MAIN CENTER MENUS */}
          <div className="hidden lg:flex lg:gap-x-8">
            {/* DROPDOWN */}
            <DropdownMenuPopover dropdownMenu={demo_pages_menu}>Demo pages</DropdownMenuPopover>

            {/* MEGA MENU */}
            <MegaMenuPopover
              megamenu={mega_menus}
              rightImage={{
                src: '/images/hijab/feature-1-2.png',
                alt: 'Featured product',
              }}
              featuredCollections={featuredCollections}
              variant={megamenuVariant}
            >
              Explore
            </MegaMenuPopover>

            {/* TEXT LINKS */}
            <TextLink href="/collections/page-style-2/all">Shop</TextLink>
            <DropdownMenuPopover dropdownMenu={demo_checkout_menu}>Checkout</DropdownMenuPopover>
          </div>

          {/* RIGHT ICON BUTTONS */}
          <div className="flex flex-1 justify-end gap-x-2.5 md:gap-x-4 xl:gap-x-5">
            {/* HAMBURGER MENU */}
            <HamburgerIconMenu />

            {/* SEARCH  */}
            <SearchIconPopover />

            {/* USER - DROPDOWN */}
            <UserIconPopover />

            {/* CART */}
            <CartIconBtn />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
