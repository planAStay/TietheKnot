'use client'

import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { Button, ButtonCircle } from '../button'
import { Heading } from '../heading'
import { Text } from '../text'

const demo_collections = [
  {
    title: '<span data-slot="italic">Premium Rayon</span> Hijab',
    desciption: 'The fabric is soft and smooth, making it easy to wear and style, and it is comfortable to wear.',
    images: [
      '/images/hijab/premium-rayon-1.webp',
      //  more images ...
    ],
  },
  {
    title: '<span data-slot="italic">Premium Chiffon</span> Hijab',
    desciption: 'Experience unparalleled comfort with our breathable hijabs, perfect for any season.',
    images: [
      '/images/hijab/essential-modal-1-1.webp',
      //  more images ...
    ],
  },
]

interface FeatureSection3Props {
  className?: string
  containerClassName?: string
  heading?: string
  collection1?: {
    title: string
    desciption: string
    images: string[]
  }
  collection2?: {
    title: string
    desciption: string
    images: string[]
  }
}

const FeatureSection3 = ({
  className,
  containerClassName = 'container',
  heading = `Essentials for <span data-slot="italic">Muslim Women</span> , from Daily Scarves to Versatile Clothing.`,
  collection1 = demo_collections[0],
  collection2 = demo_collections[1],
}: FeatureSection3Props) => {
  const [emblaRef] = useEmblaCarousel({
    slidesToScroll: 'auto',
  })
  const [emblaRef2] = useEmblaCarousel({
    slidesToScroll: 'auto',
    startIndex: 9,
  })

  return (
    <div className={clsx('overflow-hidden', className)}>
      <div className={containerClassName}>
        {/* Heading */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="flex-1/3">
            <Button href={'/collections/all'} outline>
              Our products
            </Button>
          </div>
          <Heading className="flex-2/3" bigger dangerouslySetInnerHTML={{ __html: heading }} />
        </div>

        {/* COLLECTION 1 */}
        <div className="mt-20 flex flex-col gap-10 lg:flex-row lg:gap-0">
          <div className="relative z-10 flex-1/2">
            <div className="relative aspect-5/6 w-full">
              <Image
                src={collection1.images[0]}
                alt={'feature-section'}
                fill
                className="z-0 object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                priority
              />
            </div>
          </div>
          <div className="flex flex-1/2 flex-col gap-8 lg:self-center lg:ps-10 xl:ps-16">
            {/* Heading */}
            <div className="flex items-end justify-between gap-4">
              <Heading dangerouslySetInnerHTML={{ __html: collection1.title }}></Heading>
              <ButtonCircle href={'/collections/all'}>
                <ArrowUpRightIcon className="h-4 w-4 text-zinc-50" />
              </ButtonCircle>
            </div>

            {/* SLIDER */}
            <div className="embla-overflow-unset" ref={emblaRef}>
              <div className="embla__container">
                {collection1.images
                  .filter((_, i) => i !== 0)
                  .map((image, index) => (
                    <div
                      key={index}
                      className="ms-4 min-w-0 embla__slide shrink-0 grow-0 basis-3/4 first:ms-0 sm:basis-2/5"
                    >
                      <div className="relative aspect-4/6 w-full">
                        <Image
                          src={image}
                          alt={'feature-section'}
                          fill
                          className="z-0 rounded-lg object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="flex items-end justify-between gap-4">
              <Text className="max-w-sm">{collection1.desciption}</Text>
              <Button outline href={'#'}>
                SIZE GUIDE
              </Button>
            </div>
          </div>
        </div>

        {/* COLLECTION 2 */}
        <div className="mt-20 flex flex-col-reverse gap-10 lg:mt-0 lg:flex-row lg:gap-0">
          <div className="flex flex-1/2 flex-col gap-8 lg:self-center lg:pe-10 xl:pe-16">
            {/* Heading */}
            <div className="flex items-end justify-between gap-4">
              <Heading dangerouslySetInnerHTML={{ __html: collection2.title }}></Heading>
              <ButtonCircle href={'/collections/all'}>
                <ArrowUpRightIcon className="h-4 w-4 text-zinc-50" />
              </ButtonCircle>
            </div>

            {/* SLIDER */}
            <div className="embla-overflow-unset" ref={emblaRef2}>
              <div className="embla__container flex-row">
                {collection2.images
                  .filter((_, i) => i !== 0)
                  .map((image, index) => (
                    <div
                      key={index}
                      className="ms-4 min-w-0 embla__slide shrink-0 grow-0 basis-3/4 first:ms-0 sm:basis-2/5"
                    >
                      <div className="relative aspect-4/6 w-full">
                        <Image
                          src={image}
                          alt={'feature-section'}
                          fill
                          className="z-0 rounded-lg object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="flex items-end justify-between gap-4">
              <Text className="max-w-sm">{collection2.desciption}</Text>
              <Button outline href={'#'}>
                SIZE GUIDE
              </Button>
            </div>
          </div>
          <div className="flex-1/2">
            <div className="relative aspect-5/6 w-full">
              <Image
                src={collection2.images[0]}
                alt={'feature-section'}
                fill
                className="z-0 object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureSection3
