import Breadcrumb from '@/components/breadcrumb'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Pagination, PaginationList, PaginationNext, PaginationPage, PaginationPrevious } from '@/components/pagination'
import ProductCard from '@/components/product-card'
import StarSvg from '@/components/star-svg'
import { Text } from '@/components/text'
import { getCollectionByHandle } from '@/data'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import CategoryFilters1 from '../../category-filters-1'
import ProductSortDropdown from '../../product-sort-dropdown'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollectionByHandle(handle)
  if (!collection) {
    return {
      title: 'Collection not found',
      description: 'The collection you are looking for does not exist.',
    }
  }
  const { title, description } = collection
  return { title, description }
}

export default async function Collection({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const collection = await getCollectionByHandle(handle)
  if (!collection) {
    return redirect('/collections/all')
  }
  const products = collection.products.slice(0, 6)
  const breadcrumbs = [{ id: 1, name: 'Home', href: '/' }]

  return (
    <div className="container">
      <div>
        <Breadcrumb breadcrumbs={breadcrumbs} currentPage={collection.title} className="py-3.5" />

        <Divider />

        <main className="">
          <div className="flex flex-col items-center py-14 text-center lg:py-20">
            <StarSvg />
            <Heading bigger level={1} className="mt-5">
              <span data-slot="dim">Collection</span>
              <br />
              <span data-slot="italic" className="underline">
                {collection.title}
              </span>
            </Heading>
            <Text className="mt-5 max-w-xl">{collection.description}</Text>
          </div>

          <div className="flex justify-between gap-4">
            <Text>{products.length} products</Text>
            <ProductSortDropdown align="right" />
          </div>

          <Divider className="mt-5" />

          <div className="pt-10 pb-16 sm:pt-12 sm:pb-24">
            <div className="lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
              <CategoryFilters1 />

              <section aria-labelledby="product-heading" className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
                <h2 id="product-heading" className="sr-only">
                  Products
                </h2>

                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-7 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <Pagination className="mt-14 sm:mt-20">
                  <PaginationPrevious href="?page=1" />
                  <PaginationList>
                    <PaginationPage href="?page=1" current>
                      1
                    </PaginationPage>
                    <PaginationPage href="?page=2">2</PaginationPage>
                    <PaginationPage href="?page=3">3</PaginationPage>
                    <PaginationPage href="?page=4">4</PaginationPage>
                  </PaginationList>
                  <PaginationNext href="?page=3" />
                </Pagination>
              </section>
            </div>
          </div>
        </main>
      </div>

      <Divider />
    </div>
  )
}
