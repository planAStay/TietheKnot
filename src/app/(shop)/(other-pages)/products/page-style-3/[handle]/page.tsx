import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import ProductCardHorizontal from '@/components/product-card-horizontal'
import { Text } from '@/components/text'
import {
  getFashionProducts,
  getHijabProducts,
  getProductByHandle,
  getProductReviews,
  getSkincareProducts,
  TProductItem,
} from '@/data'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FeaturedSection from '../../featured-section'
import ProductDetailContent from '../../product-detail-content'
import ProductFaqsSection from '../../product-faqs-section'
import { ProductForm } from '../../product-form'
import ProductImageCarousel from '../../product-images-carousel/product-images-carousel'
import ProductRelatedSection from '../../product-related-section'
import ProductReviewSection from '../../product-reviews-section'
import ProductUsageSection from '../../product-usage-section'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) {
    return {
      title: 'Product not found',
      description: 'Product not found',
    }
  }

  const { title, description } = product
  return { title, description }
}

export default async function Product({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product?.id) {
    return notFound()
  }

  // for demo product. you need to change for the yourself
  let otherProducts = [] as TProductItem[]
  if (product?.collections[0].handle === 'luxury-fashion') {
    otherProducts = await getFashionProducts()
  } else if (product?.collections[0].handle === 'skincare-essentials') {
    otherProducts = await getSkincareProducts()
  } else {
    otherProducts = await getHijabProducts()
  }
  const combineProduct = otherProducts?.[1]
  const relatedProducts = otherProducts?.slice(1, 6)
  const productReviews = await getProductReviews()

  const { images, description } = product

  return (
    <div className={clsx('product-page relative space-y-12 sm:space-y-16')}>
      <div className="absolute inset-x-0 -top-px z-10 h-px bg-white"></div>

      <main className="container">
        <div className="lg:flex">
          {/* Galleries */}
          <div className="relative w-full lg:w-1/2 xl:w-5/9">
            <ProductImageCarousel className="sticky top-2.5" media={images} />
          </div>

          {/* Product Details */}
          <div className="w-full pt-10 lg:w-1/2 lg:pl-10 xl:w-4/9 xl:pt-14 xl:pl-12 2xl:pt-16 2xl:pl-16">
            <div className="sticky top-16">
              {/* Heading, Price, Options,...  */}
              <ProductForm product={product} />

              {/* Combine Product */}
              {combineProduct ? (
                <div className="mt-10 rounded-lg bg-zinc-100 p-5">
                  <Text className="mb-3 font-semibold">PAIR IT WITH</Text>
                  <ProductCardHorizontal product={combineProduct} />
                </div>
              ) : null}

              <FeaturedSection className="mt-10 lg:mt-16" />
            </div>
          </div>
        </div>

        <Divider className="my-16 sm:my-24 lg:my-24" />

        {/* THE CONTENT OF PRODUCT  */}
        <Heading bigger className="text-center">
          <span data-slot="italic">all about the</span> <br />
          <span>PRODUCT</span>
        </Heading>

        {/* MAIN TAB GROUP */}
        <TabGroup className="mt-14 lg:mt-16 xl:mt-20">
          <TabList className="relative z-10 grid w-full grid-cols-2 justify-center bg-zinc-50 sm:grid-cols-4 sm:gap-4 sm:rounded-full sm:p-1">
            <div className="absolute inset-x-0 top-1/2 -z-10 block h-px -translate-y-1/2 bg-zinc-200 sm:hidden"></div>
            <div className="absolute inset-y-0 left-1/2 -z-10 block w-px -translate-x-1/2 bg-zinc-200 sm:hidden"></div>

            <Tab className="b w-full focus-visible:outline-none data-selected:bg-zinc-900 data-selected:text-white sm:rounded-full">
              <Text className="px-1 py-4">About</Text>
            </Tab>
            <Tab className="w-full focus-visible:outline-none data-selected:bg-zinc-900 data-selected:text-white sm:rounded-full">
              <Text className="px-1 py-4">Reviews</Text>
            </Tab>
            <Tab className="w-full focus-visible:outline-none data-selected:bg-zinc-900 data-selected:text-white sm:rounded-full">
              <Text className="px-1 py-4">Garment Care</Text>
            </Tab>
            <Tab className="w-full focus-visible:outline-none data-selected:bg-zinc-900 data-selected:text-white sm:rounded-full">
              <Text className="px-1 py-4">Faqs</Text>
            </Tab>
          </TabList>
          <TabPanels className="mt-10 lg:mt-16">
            <TabPanel>
              <ProductDetailContent
                content={description}
                imageSrc={
                  product?.collections[0].handle === 'skincare-essentials'
                    ? '/images/skincare/feature-1.webp'
                    : '/images/fashion/feature-1.png'
                }
              />
            </TabPanel>
            <TabPanel>
              <ProductReviewSection reviews={productReviews} />
            </TabPanel>
            <TabPanel>
              <ProductUsageSection />
            </TabPanel>
            <TabPanel>
              <ProductFaqsSection />
            </TabPanel>
          </TabPanels>
        </TabGroup>

        <Divider className="my-16 sm:my-24 lg:my-28" />

        {/* RELATED PRODUCT */}
        {relatedProducts ? <ProductRelatedSection products={relatedProducts} /> : null}
      </main>
    </div>
  )
}
