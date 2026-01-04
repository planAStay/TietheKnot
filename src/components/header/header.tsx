import { Logo } from '@/app/logo'
import WeddingDatePill from '@/components/header/wedding-date-pill'
import CategoriesToggle from '@/components/header/categories-toggle'
import ThemeToggle from '@/components/theme-toggle'
import clsx from 'clsx'
import Link from 'next/link'
import { TextLink } from '../text'
import CartIconBtn from './cart-icon-btn'
import HamburgerIconMenu from './hamburger-icon-menu'
import SearchIconPopover from './search-icon-popover'
import UserIconPopover from './user-icon-popover'

interface HeaderProps {
  className?: string
  hasBottomBorder?: boolean
  variant?: 'default' | 'bg-transparent-text-white'
}

const Header = ({ className, hasBottomBorder = true, variant = 'default' }: HeaderProps) => {
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
            'flex items-center justify-between border-primary/20 py-6',
            hasBottomBorder && 'border-b',
            !hasBottomBorder && 'has-[.bitpan-popover-full-panel]:border-b'
          )}
        >
          {/* LEFT - CATEGORIES TOGGLE & LOGO */}
          <div className="flex items-center gap-4 lg:flex-1">
            <CategoriesToggle />
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">TieTheKnot home</span>
              <Logo priority />
            </Link>
          </div>

          {/* MAIN CENTER MENUS */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-5">
            <TextLink href="/" className="text-[15px] font-semibold text-text">
              Landing
            </TextLink>
            <TextLink href="/my-wedding" className="text-[15px] font-semibold text-text">
              My Wedding
            </TextLink>
            <TextLink href="/collections/all" className="text-[15px] font-semibold text-text">
              Categories
            </TextLink>
            <TextLink href="/favorites" className="text-[15px] font-semibold text-primary">
              Favorites
            </TextLink>
            <TextLink href="/quotations" className="text-[15px] font-semibold text-accent">
              Quotations
            </TextLink>
          </div>

          {/* RIGHT ICON BUTTONS */}
          <div className="flex flex-1 items-center justify-end gap-x-2.5 md:gap-x-4 xl:gap-x-5">
            <div className="hidden sm:block">
              <WeddingDatePill compact />
            </div>
            {/* HAMBURGER MENU */}
            <HamburgerIconMenu />

            {/* SEARCH  */}
            <SearchIconPopover />

            {/* THEME TOGGLE */}
            <ThemeToggle />

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
