import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { VectorArrowDown2 } from '@/components/vector-arrow-down'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'We believe that our strength lies in our collaborative approach, which puts our clients at the center of everything we do.',
}

const Page = () => {
  return (
    <div className="container mt-16 pb-16 sm:mt-24 lg:mt-28">
      {/* SECTION1 */}
      <div className="flex flex-col justify-between gap-8 overflow-hidden lg:flex-row lg:gap-6 xl:gap-2.5">
        <div className="flex flex-2/3 flex-col gap-20 md:gap-24 lg:gap-28 xl:gap-32">
          <div className="relative">
            <Heading level={1} fontSize="text-7xl lg:text-8xl 2xl:text-9xl font-medium" className="relative w-fit">
              <span>About </span>
              <span data-slot="italic">US</span>

              <VectorArrowDown2 className="absolute -end-32 top-1/2 hidden h-20 sm:block sm:h-32 lg:-end-16 2xl:top-2/3" />
            </Heading>
          </div>

          <div className="mt-auto flex flex-col gap-8 sm:flex-row lg:gap-6 xl:gap-2.5">
            <div className="flex-1/2 xl:flex-1/3">
              <Image
                src={'/images/skincare/face-3-3.webp'}
                width={494}
                height={529}
                alt={'feature-1-2'}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="flex flex-1/2 sm:justify-center xl:flex-2/3">
              <div className="max-w-sm self-end">
                <Text>
                  Our simple philosophy in all that we do. We are passionate about skin care, we are truekind.
                </Text>
                <br />
                <Text>
                  We are a team of passionate individuals who believe in the power of natural ingredients and their
                  ability to transform your skin. Our mission is to provide you with the best products that are not only
                  effective but also safe for you and the environment.
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1/3">
          <Image
            src={'/images/skincare/hero.png'}
            width={494}
            height={529}
            alt={'feature-1-2'}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="mt-24 sm:mt-28 lg:mt-40">
        <Heading level={2} bigger>
          Some interesting information <br />
          about the <span data-slot="italic">Bitpan store!</span>
        </Heading>
        <div className="mt-14 flex flex-col justify-between gap-10 lg:flex-row">
          <div className="flex-4/9">
            <div className="">
              <Image
                src={'/images/skincare/feature-1.webp'}
                width={700}
                height={440}
                alt={'feature-1-2'}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>

          <div className="flex-5/9 self-end">
            <div className="mx-auto max-w-sm">
              <Text className="mt-8">
                Drawing from our rich ayurvedic legacy of over 30 years and embracing dermal science, we aim to create
                transparent skincare that is incredibly effective.
              </Text>

              <div className="mt-24">
                <Heading bigger>
                  <span>+40</span>
                  {` `}
                  <span data-slot="dim">years</span>
                </Heading>
                <Text className="mt-8">
                  Our simple philosophy in all that we do. We are passionate about skin care, we are truekind.
                </Text>
              </div>

              <div className="mt-11">
                <Heading bigger>
                  <span>+5000</span>
                  {` `}
                  <span data-slot="dim">clients</span>
                </Heading>
                <Text className="mt-8">We aim to create, safe and without harming the environment or the planet.</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
