import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Link } from '@/components/link'
import { Text, TextLink } from '@/components/text'
import { getOrders } from '@/data'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Your Orders',
  description: 'Check the status of recent orders, manage returns, and discover similar products.',
}

export default async function Page() {
  const orders = await getOrders()

  return (
    <div className="container">
      <div className="mx-auto max-w-3xl py-16 sm:py-24">
        <div className="max-w-xl">
          <Heading level={1} id="your-orders-heading" bigger>
            Your <span data-slot="italic">Orders</span>
          </Heading>
          <Text className="mt-2 text-zinc-500">
            Check the status of recent orders, manage returns, and discover similar products.
          </Text>
        </div>

        <div className="mt-12 space-y-20 sm:mt-16">
          {orders.map((order) => (
            <section key={order.number} aria-labelledby={`${order.number}-heading`}>
              <div className="space-y-1 md:flex md:items-baseline md:space-y-0 md:space-x-4">
                <h2 id={`${order.number}-heading`} className="text-lg font-medium text-zinc-900 md:shrink-0">
                  Order #{order.number}
                </h2>
                <div className="space-y-5 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 md:min-w-0 md:flex-1">
                  <Text className="text-xs text-zinc-500">{order.status}</Text>
                  <div className="flex items-center text-sm font-medium">
                    <TextLink href={'/orders/' + order.number} className="text-zinc-950 underline">
                      Order details
                      <span aria-hidden="true" className="font-light">
                        {' '}
                        &rarr;
                      </span>
                    </TextLink>
                  </div>
                </div>
              </div>

              <div className="mt-6 -mb-6 flow-root divide-y divide-zinc-200 border-t border-zinc-200">
                {order.products.map((product) => (
                  <div key={product.id} className="py-6 sm:flex">
                    <div className="flex space-x-4 sm:min-w-0 sm:flex-1 sm:space-x-6 lg:space-x-8">
                      <div className="relative aspect-3/4 w-20 flex-none sm:w-40">
                        <Image
                          alt={product.imageAlt}
                          src={product.imageSrc}
                          fill
                          className="rounded-md object-cover"
                          sizes="(min-width: 640px) 10rem, 100vw"
                          priority
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1.5 sm:pt-0">
                        <h3 className="text-sm font-medium text-zinc-900 uppercase">
                          <Link href={'/products/' + product.handle}>{product.name}</Link>
                        </h3>
                        <Text className="truncate text-xs text-zinc-500">
                          <span>{product.color}</span>{' '}
                          <span aria-hidden="true" className="mx-1.5 text-zinc-300">
                            /
                          </span>{' '}
                          <span>{product.size}</span>
                        </Text>
                        <Text className="text-xs text-zinc-500">Qty {product.quantity}</Text>
                        <Text className="mt-auto font-medium text-zinc-900">{product.price}</Text>
                      </div>
                    </div>
                    <div className="mt-6 max-w-48 space-y-2 sm:mt-0 sm:ml-6 sm:w-40 sm:flex-none">
                      <Button type="button" className="w-full" outline>
                        Shop similar
                      </Button>
                      <Button className="w-full" type="button">
                        Buy again
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <Divider />
    </div>
  )
}
