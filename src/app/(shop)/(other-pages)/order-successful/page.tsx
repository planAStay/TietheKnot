import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { getCartProducts } from '@/data'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Order Successful',
  description: 'Your order has been successfully placed.',
}

export default async function Page() {
  const products = await getCartProducts()

  return (
    <>
      <main className="container">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-3xl">
          <div className="">
            <div className="flex w-fit items-center justify-center rounded-full border border-zinc-900 px-6 py-2.5 text-sm font-medium">
              <span className="text-xs uppercase">Thanks for ordering</span>
            </div>
            <Heading bigger className="mt-4">
              Payment {` `}
              <span data-slot="italic">successful!</span>
            </Heading>

            <Text className="mt-2.5 text-sm text-zinc-500">
              We appreciate your order, we’re currently processing it. So hang tight and we’ll send you confirmation
              very soon!
            </Text>

            <dl className="mt-16 text-sm">
              <dt className="text-zinc-500 uppercase">Tracking number</dt>
              <dd className="mt-2 font-medium text-zinc-950"># 551548931</dd>
            </dl>

            <ul
              role="list"
              className="mt-6 divide-y divide-zinc-200 border-t border-zinc-200 text-sm font-medium text-zinc-500"
            >
              {products.map((product) => (
                <li key={product.id} className="flex space-x-6 py-6">
                  <div className="relative aspect-3/4 w-24 flex-none">
                    <Image
                      alt={product.imageAlt}
                      src={product.imageSrc}
                      fill
                      sizes="200px"
                      className="rounded-md bg-zinc-100 object-cover"
                    />
                  </div>
                  <div className="flex flex-auto flex-col space-y-1">
                    <h3 className="text-zinc-900 uppercase">
                      <Link href={'/products/' + product.handle}>{product.name}</Link>
                    </h3>
                    <div className="flex items-center space-x-2 text-zinc-500">
                      <Text className="text-xs text-zinc-500">{product.color}</Text>
                      {product.size ? <Text className="text-xs text-zinc-300">/</Text> : null}
                      {product.size ? <Text className="text-xs text-zinc-500">{product.size}</Text> : null}
                    </div>
                    <Text className="mt-auto text-xs text-zinc-500">Qty {product.quantity}</Text>
                  </div>
                  <p className="flex-none font-medium text-zinc-900">{product.price}</p>
                </li>
              ))}
            </ul>

            <dl className="space-y-6 border-t border-zinc-200 pt-6 text-sm font-medium text-zinc-500">
              <div className="flex justify-between">
                <dt className="uppercase">Subtotal</dt>
                <dd className="text-zinc-900">$72.00</dd>
              </div>

              <div className="flex justify-between">
                <dt className="uppercase">Shipping</dt>
                <dd className="text-zinc-900">$8.00</dd>
              </div>

              <div className="flex justify-between">
                <dt className="uppercase">Taxes</dt>
                <dd className="text-zinc-900">$6.40</dd>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-200 pt-6 text-zinc-900">
                <dt className="text-base uppercase">Total</dt>
                <dd className="text-base">$86.40</dd>
              </div>
            </dl>

            <dl className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-zinc-600">
              <div>
                <dt className="font-medium text-zinc-900 uppercase">Shipping Address</dt>
                <dd className="mt-2">
                  <address className="uppercase not-italic">
                    <span className="block">Kristin Watson</span>
                    <span className="block">7363 Cynthia Pass</span>
                    <span className="block">Toronto, ON N3Y 4H8</span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-900 uppercase">Payment Information</dt>
                <dd className="mt-2 space-y-2 sm:flex sm:space-y-0 sm:space-x-4">
                  <div className="flex-none">
                    <svg width={36} height={24} viewBox="0 0 36 24" aria-hidden="true" className="h-6 w-auto">
                      <rect rx={4} fill="#224DBA" width={36} height={24} />
                      <path
                        d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                        fill="#fff"
                      />
                    </svg>
                    <p className="sr-only">Visa</p>
                  </div>
                  <div className="flex-auto uppercase">
                    <p className="text-zinc-900">Ending with 4242</p>
                    <p>Expires 12 / 21</p>
                  </div>
                </dd>
              </div>
            </dl>

            <div className="mt-16 border-t border-zinc-200 py-6 text-right">
              <Link href="/collections/all" className="text-sm font-medium text-zinc-950 uppercase">
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        <Divider />
      </main>
    </>
  )
}
