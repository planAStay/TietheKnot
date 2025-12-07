import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { VectorArrowDown2 } from '@/components/vector-arrow-down'
import clsx from 'clsx'
import Image from 'next/image'

interface TImage {
  src: string
  width: number
  height: number
  alt: string
}
interface FeatureSection1Props {
  className?: string
  heading?: string
  description?: string
  image1?: TImage
  image2?: TImage
  buttonText?: string
  buttonLink?: string
}

const FeatureSection1 = ({
  className,
  description = 'We love it for modern UI design because of its simple, clean, and distinctive geometric style and the designers actively work. FEATHERLIGHT FEEL Experience unparalleled comfort with our breathable  hijabs, perfect for any season.',
  heading = `<span>What makes us</span><br /><span data-slot="italic">Difference? </span>`,
  image1 = {
    src: '/images/hijab/feature-1-1.png',
    width: 325,
    height: 325,
    alt: 'feature-1-1',
  },
  image2 = {
    src: '/images/hijab/feature-1-2.png',
    width: 494,
    height: 529,
    alt: 'feature-1-2',
  },
  buttonText = 'EXPLORE PRODUCTS',
  buttonLink = '/collections/all',
}: FeatureSection1Props) => {
  return (
    <div className={clsx('flex flex-col justify-between gap-8 lg:flex-row lg:gap-6 xl:gap-2.5', className)}>
      <div className="flex flex-2/3 flex-col gap-16">
        <div className="relative">
          <Heading
            fontSize="text-5xl font-semibold"
            dangerouslySetInnerHTML={{ __html: heading }}
            className="max-w-[400px]"
          ></Heading>
          <VectorArrowDown2 className="absolute start-60 top-1/2 hidden h-[150px] md:block 2xl:start-72 2xl:top-2/3 2xl:h-auto" />
        </div>

        <div className="mt-auto flex flex-col gap-8 sm:flex-row lg:gap-6 xl:gap-2.5">
          <div className="flex-1/2 xl:flex-1/3">
            <Image
              {...image1}
              alt={image1.alt}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>

          <div className="flex flex-1/2 sm:justify-center xl:flex-2/3">
            <div className="max-w-sm self-end">
              <Text dangerouslySetInnerHTML={{ __html: description }}></Text>
              <Button outline href={buttonLink} className="mt-7">
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1/3">
        <Image {...image2} alt={image2.alt} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
      </div>
    </div>
  )
}

export default FeatureSection1
