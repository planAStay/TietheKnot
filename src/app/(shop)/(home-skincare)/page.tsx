import FeatureSection1 from '@/components/sections/feature-section-1'
import FeatureSection2 from '@/components/sections/feature-section-2'
import FeatureSection5 from '@/components/sections/feature-section-5'
import HeroSection2 from '@/components/sections/hero-section-2'
import SectionCollectionCarousel from '@/components/sections/section-collection-carousel'
import SectionProductCarousel from '@/components/sections/section-product-carousel'
import { getCollections, getGroupCollections } from '@/data'
import clsx from 'clsx'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Skincare',
  description:
    'Discover the latest trends in skincare and beauty with our curated collection of products, tips, and more.',
}

export default async function Home() {
  let collections = await getCollections('skincare')
  let groupCollections = await getGroupCollections('skincare')

  return (
    <div>
      <HeroSection2 />

      <SectionCollectionCarousel className="container mt-20 sm:mt-28 lg:mt-28" groupCollections={groupCollections} />

      <FeatureSection1
        className="container mt-24 sm:mt-28 lg:mt-40"
        image1={{
          src: '/images/skincare/feature-1.webp',
          width: 325,
          height: 335,
          alt: 'feature-1-1',
        }}
        image2={{
          src: '/images/skincare/feature-6.webp',
          width: 495,
          height: 530,
          alt: 'feature-1-2',
        }}
        heading={`Clean, Beyond Reproach <span data-slot="italic">Skincare.</span>`}
      />

      <FeatureSection5 className="mt-24 sm:mt-28 lg:mt-40" />

      {collections
        ?.filter((_, i) => i < 3)
        .map((collection, index) => (
          <SectionProductCarousel
            key={collection.handle}
            className={clsx('container', index === 0 ? 'mt-44' : 'mt-36')}
            products={collection.products}
            collectionTitle={collection?.title}
            collectionHandle={collection?.handle}
            collectionDescription={collection?.description}
          />
        ))}

      <FeatureSection2
        className="container mt-20 sm:mt-28 lg:mt-32"
        variant="up"
        heading={`Clean, Conscious, Performance <span data-slot="italic">Skincare.</span>`}
        faqs={[
          {
            question: 'Radical Transparency',
            answer:
              "No black boxes, nothing to hide, we disclose our full formulas, so you will never have to guess what's in it and how much.",
          },
          {
            question: 'Clean, Beyond Reproach',
            answer:
              'We are committed to using only the safest, most effective ingredients, and we never compromise on quality.',
          },
          {
            question: 'Conscious & Responsible',
            answer:
              'We are committed to using only the safest, most effective ingredients, and we never compromise on quality.',
          },
          {
            question: 'Potent & Multi Tasking',
            answer:
              'We are committed to using only the safest, most effective ingredients, and we never compromise on quality.',
          },
        ]}
        image={{
          src: '/images/skincare/feature-3.png',
          width: 662,
          height: 653,
          alt: 'skincare-feature-3',
        }}
      />
    </div>
  )
}
