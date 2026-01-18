import clsx from 'clsx'

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
} & React.ComponentPropsWithoutRef<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>

export function Heading({
  className,
  level = 2,
  ...props
}: HeadingProps) {
  let Element: `h${typeof level}` = `h${level}`

  return (
    <Element
      {...props}
      className={clsx(
        className,
        'text *:data-[slot=dim]:text-text/30 *:data-[slot=italic]:font-serif *:data-[slot=italic]:font-normal *:data-[slot=italic]:italic'
      )}
    />
  )
}

export function Subheading({ className, level = 3, ...props }: HeadingProps) {
  let Element: `h${typeof level}` = `h${level}`

  return (
    <Element
      {...props}
      className={clsx(
        className,
        '*:data-[slot=dim]:text-text/30 *:data-[slot=italic]:font-serif *:data-[slot=italic]:font-normal *:data-[slot=italic]:italic'
      )}
    />
  )
}
