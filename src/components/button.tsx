import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { Link } from './link'

const styles = {
  base: [
    // Base
    'relative isolate inline-flex shrink-0 items-center justify-center gap-x-2 rounded-full border uppercase',
    // Sizing
    'px-5 py-3.5 sm:px-6 sm:py-4 text-sm/none',
    // Focus
    'focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500',
    // Disabled
    'data-disabled:opacity-50',
    // Icon
    '*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) sm:*:data-[slot=icon]:my-1 sm:*:data-[slot=icon]:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText]',
  ],
  solid: [
    // Optical border, implemented as the button background to avoid corner artifacts
    'border-transparent bg-(--btn-border)',
    // Dark mode: border is rendered on `after` so background is set to button background
    'dark:bg-(--btn-bg)',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-(--btn-bg)',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:hidden',
    // Dark mode: Subtle white outline is applied using a border
    'dark:border-white/5',
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    'after:absolute after:inset-0 after:-z-10 after:rounded-full',

    // White overlay on hover
    'data-active:after:bg-(--btn-hover-overlay) data-hover:after:bg-(--btn-hover-overlay)',
    // Dark mode: `after` layer expands to cover entire button
    'dark:after:-inset-px dark:after:rounded-lg',
    // Disabled
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  outline: [
    // Base
    'border-zinc-900 text-zinc-950 data-active:bg-zinc-950/[2.5%] data-hover:bg-zinc-950/[2.5%]',
    // Dark mode
    'dark:border-white/40 dark:text-white dark:[--btn-bg:transparent] dark:data-active:bg-white/5 dark:data-hover:bg-white/5',
    // Icon
    '[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]',
  ],
  plain: [
    // Base
    'border-transparent text-zinc-950 data-active:bg-zinc-950/5 data-hover:bg-zinc-950/5',
    // Dark mode
    'dark:text-white dark:data-active:bg-white/10 dark:data-hover:bg-white/10',
    // Icon
    '[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]',
  ],
  colors: {
    'dark/zinc': [
      `text-background [--btn-bg:var(--color-text)] [--btn-border:var(--color-primary)]/90 [--btn-hover-overlay:var(--color-background)]/10`,
      `dark:text-background dark:[--btn-bg:var(--color-primary)] dark:[--btn-hover-overlay:var(--color-background)]/5`,
      `[--btn-icon:var(--color-secondary)] data-active:[--btn-icon:var(--color-accent)] data-hover:[--btn-icon:var(--color-accent)]`,
    ],
    light: [
      `text-text [--btn-bg:var(--color-background)] [--btn-border:var(--color-text)]/10 [--btn-hover-overlay:var(--color-text)]/[2.5%] data-active:[--btn-border:var(--color-text)]/15 data-hover:[--btn-border:var(--color-text)]/15`,
      `dark:text-background dark:[--btn-hover-overlay:var(--color-background)]/5 dark:[--btn-bg:var(--color-primary)]`,
      `[--btn-icon:var(--color-secondary)] data-active:[--btn-icon:var(--color-primary)] data-hover:[--btn-icon:var(--color-primary)]`,
    ],

    'dark/white': [
      `text-background [--btn-bg:var(--color-text)] [--btn-border:var(--color-primary)]/90 [--btn-hover-overlay:var(--color-background)]/10`,
      `dark:text-text dark:[--btn-bg:var(--color-background)] dark:[--btn-hover-overlay:var(--color-text)]/5`,
      `[--btn-icon:var(--color-secondary)] data-active:[--btn-icon:var(--color-primary)] data-hover:[--btn-icon:var(--color-primary)]`,
    ],

    dark: [
      `text-background [--btn-bg:var(--color-text)] [--btn-border:var(--color-primary)]/90 [--btn-hover-overlay:var(--color-background)]/10`,
      `dark:[--btn-hover-overlay:var(--color-background)]/5 dark:[--btn-bg:var(--color-primary)]`,
      `[--btn-icon:var(--color-secondary)] data-active:[--btn-icon:var(--color-accent)] data-hover:[--btn-icon:var(--color-accent)]`,
    ],

    white: [
      `text-text [--btn-bg:var(--color-background)] [--btn-border:var(--color-text)]/10 [--btn-hover-overlay:var(--color-text)]/[2.5%] data-active:[--btn-border:var(--color-text)]/15 data-hover:[--btn-border:var(--color-text)]/15`,
      `dark:[--btn-hover-overlay:var(--color-text)]/5`,
      `[--btn-icon:var(--color-secondary)] data-active:[--btn-icon:var(--color-primary)] data-hover:[--btn-icon:var(--color-primary)]`,
    ],

    zinc: [
      `text-background [--btn-hover-overlay:var(--color-background)]/10 [--btn-bg:var(--color-text)] [--btn-border:var(--color-primary)]/90`,
      `dark:[--btn-hover-overlay:var(--color-background)]/5`,
      `[--btn-icon:var(--color-secondary)] data-active:[--btn-icon:var(--color-accent)] data-hover:[--btn-icon:var(--color-accent)]`,
    ],

    /* PRIMARY SET — replaces indigo, blue, emerald, green, etc. */
    primary: [
      `text-background [--btn-hover-overlay:var(--color-background)]/10 [--btn-bg:var(--color-primary)] [--btn-border:var(--color-text)]/90`,
      `[--btn-icon:var(--color-background)] data-active:[--btn-icon:var(--color-background)] data-hover:[--btn-icon:var(--color-background)]`,
    ],

    /* SECONDARY SET — replaces cyan, lime, yellow */
    secondary: [
      `text-text [--btn-bg:var(--color-secondary)] [--btn-border:var(--color-primary)]/80 [--btn-hover-overlay:var(--color-background)]/25`,
      `[--btn-icon:var(--color-primary)]`,
    ],

    /* ACCENT SET — replaces red, orange, pink, rose */
    accent: [
      `text-background [--btn-hover-overlay:var(--color-background)]/10 [--btn-bg:var(--color-accent)] [--btn-border:var(--color-primary)]/90`,
      `[--btn-icon:var(--color-background)] data-active:[--btn-icon:var(--color-background)] data-hover:[--btn-icon:var(--color-background)]`,
    ],
  },

  //
  baseForCircle: [
    // Base
    'relative isolate inline-flex shrink-0 items-center justify-center rounded-full border font-medium uppercase',
    // Sizing
    'p-3 sm:p-3.5 text-sm/none',
    // Focus
    'focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500',
    // Disabled
    'data-disabled:opacity-50',
    // Icon
    '*:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-iconxxx) forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText]',
  ],
}

type ButtonProps = (
  | { color?: keyof typeof styles.colors; outline?: never; plain?: never }
  | { color?: never; outline: true; plain?: never }
  | { color?: never; outline?: never; plain: true }
) & { className?: string; children: React.ReactNode } & (
    | Omit<Headless.ButtonProps, 'as' | 'className'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
  )

export const Button = forwardRef(function Button(
  { color, outline, plain, className, children, ...props }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  let classes = clsx(
    className,
    styles.base,
    outline ? styles.outline : plain ? styles.plain : clsx(styles.solid, styles.colors[color ?? 'dark/zinc'])
  )

  return 'href' in props ? (
    <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
      <TouchTarget>{children}</TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={clsx(classes, 'cursor-default')} ref={ref}>
      <TouchTarget>{children}</TouchTarget>
    </Headless.Button>
  )
})

export const ButtonCircle = forwardRef(function Button(
  { color, outline, plain, className, children, ...props }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  let classes = clsx(
    className,
    styles.baseForCircle,
    outline ? styles.outline : plain ? styles.plain : clsx(styles.solid, styles.colors[color ?? 'dark/zinc'])
  )

  return 'href' in props ? (
    <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
      <TouchTarget>{children}</TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={clsx(classes, 'cursor-default')} ref={ref}>
      <TouchTarget>{children}</TouchTarget>
    </Headless.Button>
  )
})

/**
 * Expand the hit area to at least 44×44px on touch devices
 */
export function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  )
}
