import clsx from 'clsx'
import Image from 'next/image'
import ButtonLargeWithIcon from '../button-large-with-icon'
import { Text } from '../text'

interface HeroSection1Props {
  className?: string
}

const HeroSection1 = ({ className }: HeroSection1Props) => {
  return (
    <div className={clsx('flex flex-col items-center gap-16', className)}>
      <div className="flex w-full flex-col justify-between gap-6 md:flex-row">
        <div className="w-full">
          <Image
            src="/images/hijab/hero-1-1.png"
            alt="hero-1"
            width={450}
            height={340}
            className="w-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <Text className="mt-2.5 max-w-xs">Minimalist design, easy to coordinate, suitable for many body shapes.</Text>
        </div>
        <div className="w-full">
          <Image
            src="/images/hijab/hero-1-2.png"
            alt="hero-1"
            width={450}
            className="w-full"
            height={440}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <div className="flex w-full flex-col justify-end gap-2.5">
          <Text className="max-w-xs self-end text-right">
            The fabric is comfortable to wear in any season of the year.
          </Text>
          <Image
            src="/images/hijab/hero-1-3.png"
            alt="hero-1"
            className="w-full"
            width={450}
            height={280}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <Text className="max-w-xs">sophisticated but timeless design.</Text>
        </div>
      </div>
      <ButtonLargeWithIcon href="/collections/all">explore all products</ButtonLargeWithIcon>
    </div>
  )
}

export default HeroSection1
