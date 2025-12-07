import Breadcrumb from '@/components/breadcrumb'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Pagination, PaginationList, PaginationNext, PaginationPage, PaginationPrevious } from '@/components/pagination'
import ProductCard from '@/components/product-card'
import { Text } from '@/components/text'
import { getCollectionByHandle } from '@/data'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import CategoryFilters2 from '../category-filters-2'
import ProductSortDropdown from '../product-sort-dropdown'
import StarSvg from '../star-svg'

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
  if (!collection?.id) {
    return redirect('/collections/all')
  }
  const products = collection.products
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

          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex gap-2.5">
              <Text className="text-zinc-500">{products.length} products</Text>
              <Text className="text-zinc-300">/</Text>
              <ProductSortDropdown />
            </div>

            <CategoryFilters2 className="ml-auto" />
          </div>

          <Divider className="mt-5" />

          <div className="pt-10 pb-16 sm:pt-12 sm:pb-24">
            <section>
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-7 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination className="mx-auto mt-14 sm:mt-20">
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
        </main>
      </div>

      <Divider />
    </div>
  )
}
