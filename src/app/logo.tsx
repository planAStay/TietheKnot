import clsx from 'clsx'

type LogoProps = {
  className?: string
  priority?: boolean
}

export function Logo({ className, priority = false }: LogoProps) {
  return (
    <img
      src="/images/company-logo.svg"
      alt="TieTheKnot logo"
      className={clsx('h-10 w-auto', className)}
      loading={priority ? 'eager' : 'lazy'}
    />
  )
}
