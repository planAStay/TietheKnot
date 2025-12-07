import { getCartProducts } from '@/data'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import Image from 'next/image'
import { Aside } from './aside/aside'
import { Button } from './button'
import { Text, TextLink } from './text'

interface Props {
  className?: string
}

const AsideSidebarCart = async ({ className = '' }: Props) => {
  const products = await getCartProducts()

  return (
    <Aside openFrom="right" type="cart" heading="Shopping Cart">
      <div className={clsx('flex h-full flex-col', className)}>
        {/* CONTENT */}

        <div className="flex-1 overflow-x-hidden overflow-y-auto py-6 hidden-scrollbar">
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-zinc-900/10">
              {products.map((product) => (
                <CartProductItem key={product.id} product={product} />
              ))}
            </ul>
          </div>
        </div>

        {/* FOOTER  */}
        <section
          aria-labelledby="summary-heading"
          className="mt-auto grid shrink-0 gap-4 border-t border-zinc-900/10 py-6"
        >
          <h2 id="summary-heading" className="sr-only">
            Order summary
          </h2>
          <div className="">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <Text className="font-medium">Subtotal</Text>
              <Text className="font-medium">$154.00</Text>
            </div>
            <Text className="mt-0.5 text-xs text-zinc-500">Shipping and taxes calculated at checkout.</Text>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button outline href={'/cart'}>
                View cart
              </Button>
              <Button href={'/checkout'}>Check out</Button>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-zinc-500">
              <Text className="text-xs">
                or{' '}
                <TextLink href={'/collections/all'} className="text-xs font-medium text-zinc-900 uppercase">
                  Continue Shopping<span aria-hidden="true"> →</span>
                </TextLink>
              </Text>
            </div>
          </div>
        </section>
      </div>
    </Aside>
  )
}

export const CartProductItem = ({
  product,
  className,
}: {
  className?: string
  product: Awaited<ReturnType<typeof getCartProducts>>[number]
}) => {
  return (
    <li key={product.id} className={clsx(className, 'flex py-6')}>
      <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-md">
        <Image
          fill
          alt={product.imageAlt}
          src={product.imageSrc}
          className="size-full object-cover"
          sizes="(min-width: 640px) 10rem, 100vw"
        />
      </div>

      <div className="ms-4 flex flex-1 flex-col">
        <div className="flex justify-between font-medium">
          <h3 className="leading-tight">
            <TextLink href={'/products/' + product.handle}>{product.name}</TextLink>
          </h3>
          <Text className="ms-4">{product.price}</Text>
        </div>
        <div className="mt-1 flex gap-1.5 text-xs text-zinc-500">
          <Text className="text-xs">{product.color}</Text>
          {product.size ? <Text className="text-xs">/</Text> : null}
          {product.size ? <Text className="text-xs">{product.size}</Text> : null}
        </div>
        <Text className="mt-1 text-xs text-zinc-500">{product.price}</Text>
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <div className="inline-grid w-full max-w-16 grid-cols-1">
            <select
              name={`quantity-${product.id}`}
              aria-label={`Quantity, ${product.name}`}
              className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-0.5 ps-3 pe-8 text-xs/6 outline-1 -outline-offset-1 outline-zinc-900/10 focus:outline-1"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 me-2 size-4 self-center justify-self-end text-zinc-500"
            />
          </div>

          <button type="button" className="-m-2 cursor-pointer p-2 font-medium" title="Remove item from cart">
            <span className="sr-only">Remove</span>
            <HugeiconsIcon icon={Delete02Icon} size={16} color="currentColor" strokeWidth={1} />
          </button>
        </div>
      </div>
    </li>
  )
}

export default AsideSidebarCart
