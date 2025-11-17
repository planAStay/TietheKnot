import { Divider } from '@/components/divider'
import FeatureSection1 from '@/components/sections/feature-section-1'
import FeatureSection2 from '@/components/sections/feature-section-2'
import FeatureSection3 from '@/components/sections/feature-section-3'
import HeroSection1 from '@/components/sections/hero-section-1'
import SectionBiggestHeading from '@/components/sections/section-biggest-heading'
import SectionCollectionCarousel from '@/components/sections/section-collection-carousel'
import SectionProductCarousel from '@/components/sections/section-product-carousel'
import { getCollections, getGroupCollections } from '@/data'
import clsx from 'clsx'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hijab',
  description:
    'Discover the latest trends in fashion and style with our curated collection of clothing, accessories, and more.',
}

export default async function Home() {
  let collections = await getCollections('hijab')
  let groupCollections = await getGroupCollections('hijab')
  return (
    <div>
      <HeroSection1 className="container mt-14" />
      <SectionBiggestHeading className="container mt-20 sm:mt-28 lg:mt-32 2xl:mt-20" />
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
      <FeatureSection1 className="container mt-24 sm:mt-28 lg:mt-40" />
      <FeatureSection2 className="container mt-20 sm:mt-28 lg:mt-32" />
      <div className="container mt-24 sm:mt-28 lg:mt-40">
        <Divider />
      </div>
      <FeatureSection3
        className="mt-20 sm:mt-28 lg:mt-32"
        heading={`Essentials for <span data-slot="italic">Muslim Women</span> , from Daily Scarves to Versatile Clothing.`}
        collection1={{
          title: '<span data-slot="italic">Premium Rayon</span> Hijab',
          desciption: 'The fabric is soft and smooth, making it easy to wear and style, and it is comfortable to wear.',
          images: [
            '/images/hijab/premium-rayon-1.webp',
            '/images/hijab/premium-rayon-2.webp',
            '/images/hijab/premium-rayon-3.webp',
            '/images/hijab/premium-rayon-4.webp',
            '/images/hijab/premium-rayon-1.webp',
          ],
        }}
        collection2={{
          title: '<span data-slot="italic">Premium Chiffon</span> Hijab',
          desciption: 'Experience unparalleled comfort with our breathable hijabs, perfect for any season.',
          images: [
            '/images/hijab/essential-modal-1-1.webp',
            '/images/hijab/essential-modal-1-1.webp',
            '/images/hijab/essential-modal-1.webp',
            '/images/hijab/essential-modal-3.webp',
            '/images/hijab/essential-modal-4.webp',
          ],
        }}
      />
      <div className="container mt-20 sm:mt-28 lg:mt-32">
        <Divider />
      </div>
      <SectionCollectionCarousel className="container mt-20" groupCollections={groupCollections} />
    </div>
  )
}
