import BlogPostCart from '@/components/blog-post-cart'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Pagination, PaginationList, PaginationNext, PaginationPage, PaginationPrevious } from '@/components/pagination'
import { Text } from '@/components/text'
import { getBlogPosts } from '@/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Stay up-to-date with the latest industry news as our marketing teams finds new ways to re-purpose old CSS tricks articles.',
}

export default async function Page() {
  const posts = await getBlogPosts()

  return (
    <div className="container">
      <div className="flex flex-col items-center py-14 text-center lg:py-20">
        <Heading bigger level={1} className="mt-5">
          <span>Clean</span>
          <br />
          <span data-slot="italic" className="underline">
            Journal.
          </span>
        </Heading>
        <Text className="mt-5 max-w-xl">
          Stay up-to-date with the latest industry news as our marketing teams finds new ways to re-purpose old CSS
          tricks articles.
        </Text>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:mx-0 xl:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCart key={post.id} post={post} />
        ))}
      </div>

      <Pagination className="mx-auto mt-14 sm:mt-28">
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

      <Divider className="mt-16 sm:mt-24 lg:mt-28" />
    </div>
  )
}
