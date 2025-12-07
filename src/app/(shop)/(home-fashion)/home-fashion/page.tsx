import { Divider } from '@/components/divider'
import FeatureSection2 from '@/components/sections/feature-section-2'
import FeatureSection3 from '@/components/sections/feature-section-3'
import HeroSection3 from '@/components/sections/hero-section-3'
import SectionCollectionCarousel from '@/components/sections/section-collection-carousel'
import SectionProductCarousel from '@/components/sections/section-product-carousel'
import { getCollections, getGroupCollections } from '@/data'
import clsx from 'clsx'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fashion',
  description:
    'Discover the latest trends in fashion and style with our curated collection of clothing, accessories, and more.',
}

export default async function Home() {
  let collections = await getCollections('fashion')
  let groupCollections = await getGroupCollections('fashion')

  return (
    <div>
      <HeroSection3 />

      <SectionCollectionCarousel className="container mt-20 sm:mt-28 lg:mt-28" groupCollections={groupCollections} />

      {collections
        ?.filter((_, i) => i < 3)
        .map((collection, index) => (
          <SectionProductCarousel
            key={index}
            className={clsx('container', index === 0 ? 'mt-44' : 'mt-36')}
            products={collection?.products}
            collectionTitle={collection?.title}
            collectionHandle={collection?.handle}
            collectionDescription={collection?.description}
          />
        ))}

      <FeatureSection2
        className="container mt-20 sm:mt-28 lg:mt-32"
        variant="up"
        heading={`Culture Is <span data-slot="italic">More</span> Than a Set <span data-slot="italic">Of</span> Documents`}
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
          src: '/images/fashion/feature-1.png',
          width: 644,
          height: 653,
          alt: 'fashion-feature-1',
        }}
      />

      <div className="container mt-24 sm:mt-28 lg:mt-40">
        <Divider />
      </div>

      <FeatureSection3
        className="mt-20 sm:mt-28 lg:mt-32"
        heading={`Explore our exclusive designs, blending luxury with <span data-slot="italic">timeless elegance.</span>`}
        collection1={{
          title: 'NYC collection <br /><span data-slot="italic">edition.</span>',
          desciption: 'Discover our exclusive collection of printed modal scarves, designed to elevate your style',
          images: [
            '/images/fashion/newyork.jpg',
            '/images/fashion/newyork-1.jpg',
            '/images/fashion/newyork-2.jpg',
            '/images/fashion/newyork-3.jpg',
          ],
        }}
        collection2={{
          title: 'The artist´s <br /> <span data-slot="italic">wardrobe.</span>',
          desciption: 'Discover our exclusive collection of printed modal scarves, designed to elevate your style',
          images: [
            '/images/fashion/NewYork-3.png',
            '/images/fashion/p1-1.jpg',
            '/images/fashion/p2-1.jpg',
            '/images/fashion/p3-1.jpg',
          ],
        }}
      />
    </div>
  )
}
