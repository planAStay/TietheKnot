'use client'

import { Logo } from '@/app/logo'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { createContext, type ReactNode, useContext, useState } from 'react'

/**
 * Drawer component that opens on user click.
 * @param heading - string. Shown at the top of the drawer.
 * @param open - boolean state. if true opens the drawer.
 * @param onClose - function should set the open state.
 * @param openFrom - right, left
 * @param children - react children node.
 */
export function Aside({
  heading,
  logoOnHeading = false,
  openFrom = 'right',
  children,
  type,
  contentMaxWidthClassName = 'max-w-lg',
  animated = true,
}: {
  heading?: string
  logoOnHeading?: boolean
  openFrom: 'right' | 'left'
  children: React.ReactNode
  type: AsideType
  contentMaxWidthClassName?: string
  animated?: boolean
}) {
  const { type: activeType, close } = useAside()
  const open = type === activeType

  const onClose = close

  const hasHeading = !!heading || logoOnHeading

  return (
    <Dialog as="div" className="relative z-50" onClose={onClose} open={open}>
      <DialogBackdrop
        {...(animated ? { transition: true } : {})}
        className={clsx(
          'fixed inset-0 bg-text/60',
          animated && 'duration-300 ease-out data-closed:opacity-0'
        )}
      />

      <div className="fixed inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <div className={clsx('fixed inset-y-0 flex max-w-full', openFrom === 'right' && 'right-0')}>
            <DialogPanel
              {...(animated ? { transition: true } : {})}
              className={clsx(
                contentMaxWidthClassName,
                'h-screen w-screen translate-x-0 overflow-hidden bg-surface text-start align-middle shadow-xl',
                animated &&
                  'ease-out data-leave:duration-300 data-enter:duration-100',
                animated && openFrom === 'left' && 'data-enter:data-closed:-translate-x-full data-leave:data-closed:-translate-x-full',
                animated && openFrom === 'right' && 'data-enter:data-closed:translate-x-full data-leave:data-closed:translate-x-full'
              )}
            >
              <div className="flex h-full flex-col px-4 md:px-8">
                <header
                  className={`flex h-16 flex-shrink-0 items-center border-b border-primary/30 md:h-20 ${
                    hasHeading ? 'justify-between' : 'justify-end'
                  }`}
                >
                  {hasHeading && (
                    <>
                      {!!heading && !logoOnHeading && (
                        <DialogTitle>
                          <span className="font-serif text-2xl font-medium text-text">{heading}</span>
                        </DialogTitle>
                      )}
                      {logoOnHeading && <Logo />}
                    </>
                  )}

                  <button type="button" className="group -m-4 cursor-pointer p-4 text-text hover:text-primary" onClick={onClose}>
                    <HugeiconsIcon
                      className="transition-transform duration-200 group-hover:rotate-90"
                      icon={Cancel01Icon}
                      size={24}
                      strokeWidth={1}
                    />
                  </button>
                </header>
                <div className="flex-1 overflow-hidden">{children}</div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

/* Use for associating arialabelledby with the title*/
Aside.Title = DialogTitle

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault)

  function openDrawer() {
    setIsOpen(true)
  }

  function closeDrawer() {
    setIsOpen(false)
  }

  return {
    isOpen,
    openDrawer,
    closeDrawer,
  }
}

type AsideType =
  | 'search'
  | 'cart'
  | 'mobile'
  | 'closed'
  | 'sidebar-navigation'
  | 'category-filters'
  | 'categories-panel'
type AsideContextValue = {
  type: AsideType
  open: (mode: AsideType) => void
  close: () => void
}
//
const AsideContext = createContext<AsideContextValue | null>(null)

export function AsideProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<AsideType>('closed')

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  )
}

export function useAside() {
  const aside = useContext(AsideContext)
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider')
  }
  return aside
}
