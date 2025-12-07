import { ArrowUpRightIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { Button } from '../button'
import { Heading } from '../heading'
import StarSvg from '../star-svg'
import { Text } from '../text'

interface HeroSection3Props {
  className?: string
}

const HeroSection3 = ({ className }: HeroSection3Props) => {
  return (
    <div className="relative flex min-h-dvh w-full">
      <Image src={'/images/fashion/hero-1.png'} alt="hero" className="object-cover object-center" fill priority />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative container flex flex-1 pt-20 pb-36">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-y-7 self-center text-center text-white">
          <StarSvg width={48} height={48} color="white" />
          <Heading fontSize="text-5xl/none md:text-6xl/none lg:text-7xl/none 2xl:text-8xl/none font-semibold">
            <span data-slot="italic">Where</span> Luxury <br /> finds its <span data-slot="italic">Meaning.</span>
          </Heading>
          <Text className="max-w-sm">
            Unreservedly honest products that truly work, and be kind to skin and the planet – no exceptions!
          </Text>
        </div>
      </div>

      <div className="absolute bottom-14 left-1/2 container max-w-3xl -translate-x-1/2 sm:bottom-20">
        <Button
          href={'/collections/all'}
          color="white"
          className="mt-10 w-full cursor-pointer !border-white py-5 font-medium tracking-wide underline sm:py-6"
        >
          Explore all products
          <div className="absolute right-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white sm:h-12 sm:w-12">
            <ArrowUpRightIcon className="h-4 w-4" />
          </div>
        </Button>
      </div>
    </div>
  )
}

export default HeroSection3
