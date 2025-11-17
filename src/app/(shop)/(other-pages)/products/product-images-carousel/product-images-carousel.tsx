'use client'

import clsx from 'clsx'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import React from 'react'
import { DotButton, useDotButton } from './dot-buttons'

interface TImage {
  src: string
  alt?: string
  width?: number
  height?: number
}

type PropType = {
  media: TImage[]
  options?: EmblaOptionsType
  className?: string
}

const ProductImageCarousel: React.FC<PropType> = (props) => {
  const {
    media: slides,
    options = {
      slidesToScroll: 'auto',
    },
    className,
  } = props

  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  // get the scroll progress by selectedIndex
  const currentScrollProgress = scrollSnaps[selectedIndex] * 100

  return (
    <section className={clsx('flex flex-col gap-2.5 xl:flex-row xl:gap-5', className)}>
      <div className="embla__viewport flex-1 overflow-hidden" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((image, index) => (
            <div className="embla__slide basis-full" key={index + '--image'}>
              <div className="relative aspect-3/4 w-full">
                <Image
                  src={image.src}
                  alt={image.alt || 'Product images'}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  fill
                  className="h-full w-full cursor-ew-resize object-cover"
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__progress hidden w-0.5 overflow-hidden bg-zinc-900 xl:flex">
        <div
          className="embla__progress__bar translate-3d bg-zinc-200 sm:w-full"
          // @ts-ignore
          style={{ '--tw-translate-y': `${currentScrollProgress}%` }}
          aria-label="Scroll progress"
          role="progressbar"
        />
      </div>

      <div className="embla__controls w-full shrink-0 self-end xl:w-16 2xl:w-20">
        <div className="embla__dots flex gap-2.5 xl:flex-col">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={clsx('embla__dot relative max-w-12 flex-1 sm:max-w-16 xl:max-w-none')}
            >
              <div className="relative aspect-3/4">
                <span className="sr-only">Go to slide {index + 1}</span>
                <Image
                  src={slides[index].src}
                  alt={slides[index].alt || 'Product images'}
                  sizes={'100px'}
                  fill
                  className="h-full w-full object-cover"
                  priority
                />

                <div
                  className={clsx(
                    'absolute inset-0 bg-zinc-900/25 transition-opacity',
                    index !== selectedIndex && 'opacity-0'
                  )}
                />
              </div>
            </DotButton>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductImageCarousel
