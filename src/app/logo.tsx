import clsx from 'clsx'

type LogoProps = {
  className?: string
  priority?: boolean
  variant?: 'dark' | 'primary'
}

export function Logo({ className, priority = false, variant = 'dark' }: LogoProps) {
  // variant 'dark' = #2C2C2C for light backgrounds
  // variant 'primary' = #F5B5A9 for dark backgrounds (header/footer)
  const filterStyle = variant === 'primary' 
    ? { filter: 'brightness(0) saturate(100%) invert(77%) sepia(18%) saturate(1127%) hue-rotate(309deg) brightness(102%) contrast(96%)' }
    : { filter: 'brightness(0) saturate(100%) invert(17%) sepia(0%) saturate(0%) hue-rotate(241deg) brightness(96%) contrast(92%)' }
  
  return (
    <img
      src="/images/company-logo.svg"
      alt="TieTheKnot logo"
      className={clsx('h-10 w-auto', className)}
      loading={priority ? 'eager' : 'lazy'}
      style={filterStyle}
    />
  )
}
