import { VectorArrowDown3, VectorArrowDown4 } from '@/components/vector-arrow-down'
import { TImage } from '@/type'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import Image from 'next/image'
import { Heading } from '../heading'
import { Text } from '../text'

interface FeatureSection2Props {
  className?: string
  variant?: 'down' | 'up'
  heading?: string
  faqs?: {
    question: string
    answer: string
  }[]
  image?: TImage
}

const faqs_demo = [
  {
    question: 'TO CREATE MODEST FASHION THAT EMPOWERS',
    answer: 'TO CREATE MODEST FASHION THAT EMPOWERS, INSPIRES, AND ELEVATES WOMEN AROUND THE WORLD.',
  },
  {
    question: 'TO DESIGN TIMELESS PIECES',
    answer: 'TO DESIGN TIMELESS PIECES THAT TRANSCEND TRENDS AND LIVE IN YOUR WARDROBE FOREVER.',
  },
  {
    question: 'TO CHAMPION SUSTAINABLE PRACTICES',
    answer: 'TO CHAMPION SUSTAINABLE PRACTICES, CRAFTING QUALITY THAT HONORS OUR PLANET.',
  },
  {
    question: 'TO BUILD A COMMUNITY ROOTED IN FAITH',
    answer: 'TO BUILD A COMMUNITY ROOTED IN FAITH, SELF-LOVE, AND EMPOWERMENT.',
  },
  {
    question: 'FASHION SHOULD BE MEANINGFUL',
    answer: 'TO CREATE WITH PURPOSE, BECAUSE FASHION SHOULD BE MEANINGFUL, NOT DISPOSABLE.',
  },
]
const image_demo = {
  src: '/images/hijab/feature-2-1.png',
  width: 662,
  height: 653,
  alt: 'feature-2-1',
}

const FeatureSection2 = ({
  className,
  variant = 'down',
  heading,
  faqs = faqs_demo,
  image = image_demo,
}: FeatureSection2Props) => {
  return (
    <div className={clsx('flex flex-col justify-between gap-8 lg:flex-row', className)}>
      <div className="relative flex-1/2 2xl:flex-3/7">
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          priority
        />
        {variant === 'down' ? (
          <VectorArrowDown3 className="absolute start-full top-full hidden -translate-x-1/5 -translate-y-full lg:block xl:top-[96%]" />
        ) : null}
        {variant === 'up' ? (
          <VectorArrowDown4 className="absolute start-full top-0 hidden -translate-x-1/5 lg:block" />
        ) : null}
      </div>

      <div className="relative flex flex-1/2 lg:justify-center 2xl:flex-4/7">
        <div className={clsx('w-full max-w-md', variant === 'up' && 'self-end', variant === 'down' && 'self-start')}>
          {heading && <Heading className="mb-8" dangerouslySetInnerHTML={{ __html: heading }}></Heading>}

          <dl className="divide-y divide-zinc-900/10">
            {faqs.map((faq, index) => (
              <Disclosure defaultOpen={index === 0} key={faq.question} as="div" className="py-6 first:pt-0 last:pb-0">
                <dt>
                  <DisclosureButton className="group flex w-full justify-between text-start">
                    <Text className="font-medium">{faq.question}</Text>
                    <span className="ms-6 self-center text-zinc-600 dark:text-zinc-400">
                      <PlusIcon aria-hidden="true" className="size-4 group-data-open:hidden" />
                      <MinusIcon aria-hidden="true" className="size-4 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="mt-3">
                  <Text className="max-w-sm text-zinc-600">{faq.answer}</Text>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default FeatureSection2
