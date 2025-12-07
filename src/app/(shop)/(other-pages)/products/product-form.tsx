'use client'

import { useAside } from '@/components/aside'
import Breadcrumb from '@/components/breadcrumb'
import ButtonLargeWithIcon from '@/components/button-large-with-icon'
import { Heading } from '@/components/heading'
import InputNumber from '@/components/input-number'
import { Text, TextLink } from '@/components/text'
import { TProductItem } from '@/data'
import { StarIcon } from '@heroicons/react/24/solid'
import { ShoppingBag03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { useState } from 'react'

export function ProductForm({ product }: { product: TProductItem }) {
  const { open: openAside } = useAside()
  const { options, selected_options, collections, title, price } = product
  const status = 'in stock'

  const collection = collections[0]
  const currentColor = selected_options.filter((option) => option.name === 'Color')?.[0].value

  // NOTE: this for demo ...
  // You need to recalculate according to your data structure and project
  const [quantity, setQuantity] = useState(1)
  const [stateSelectedOption, setStateSelectedOption] = useState<{ name: string; value: string }[]>(selected_options)

  const breadcrumbs = [
    { id: 1, name: 'Home', href: '/' },
    {
      id: 2,
      name: collection.title,
      href: '/collections/all',
    },
  ]
  //
  return (
    <div>
      {/* ---------- HEADING ----------  */}
      <div>
        <Breadcrumb breadcrumbs={breadcrumbs} currentPage={title} />

        <Heading level={1} className="mt-4" title={title} bigger>
          <span data-slot="italic">{currentColor}</span>
          <br />
          <span className="lowercase" data-slot="dim">
            {title}
          </span>
        </Heading>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="rounded-full bg-zinc-900 px-5 py-2">
            <Text className="text-xs text-white">{product.vendor}</Text>
          </div>
          <Text className="text-xl">${price.toFixed(2)}</Text>
          <Text className="font-light text-zinc-400">/</Text>

          {/* Reviews */}
          <div className="flex items-center gap-1">
            <span className="sr-only">4.94 rating</span>
            <StarIcon className="size-5" />
            <Text>4.94</Text>
            <Text>·</Text>
            <TextLink className="!capitalize underline" href={'#reviews'}>
              172 reviews
            </TextLink>
          </div>
        </div>
      </div>

      {/* ---------- ADD TO CART FORM ----------  */}
      <form className="mt-10 block">
        {/* Variants */}
        <div className="flex flex-col gap-7">
          {options?.map(({ name: optionName, optionValues }) => {
            return (
              <div key={optionName}>
                <Text>{optionName}</Text>

                <div
                  className={clsx(
                    'mt-2',
                    optionName === 'Color' ? 'flex items-center gap-x-3' : 'grid grid-cols-3 gap-3 sm:grid-cols-6'
                  )}
                >
                  {optionValues.map(({ name, swatch }, index) => {
                    // NOTE: this for demo ...
                    // You need to recalculate according to your data structure and project
                    const selected = stateSelectedOption.some((opt) => opt.name === optionName && opt.value === name)
                    const inStock = index !== 2
                    const url = '#'

                    return (
                      <div
                        key={optionName + name}
                        className={clsx(
                          'block shrink-0',
                          inStock ? 'cursor-pointer' : 'cursor-not-allowed',
                          selected && ''
                        )}
                        aria-disabled={!inStock}
                        onClick={() => {
                          if (inStock) {
                            setStateSelectedOption((prev) => {
                              const newOptions = [...prev]
                              const optionIndex = newOptions.findIndex((opt) => opt.name === optionName)
                              if (optionIndex !== -1) {
                                newOptions[optionIndex] = { name: optionName, value: name }
                              } else {
                                newOptions.push({ name: optionName, value: name })
                              }
                              return newOptions
                            })
                          }
                        }}
                      >
                        <ProductOptionSwatch swatch={swatch} name={name} isSelected={selected} inStock={inStock} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Add to cart button */}
        <div className="mt-14 flex flex-col gap-8">
          <InputNumber className="gap-x-5" label="Qty" defaultValue={quantity} onChange={setQuantity} />
          <ButtonLargeWithIcon
            icon={<HugeiconsIcon icon={ShoppingBag03Icon} size={20} color="currentColor" strokeWidth={1.5} />}
            onClick={() => openAside('cart')}
          >
            Add to cart
          </ButtonLargeWithIcon>
        </div>
      </form>
    </div>
  )
}

type TSwatch = {
  color?: string | null
  image?: {
    src: string
    alt?: string
  } | null
}
function ProductOptionSwatch({
  swatch,
  name,
  isSelected,
  inStock,
}: {
  swatch?: TSwatch | null
  name: string
  isSelected: boolean
  inStock: boolean
}) {
  const image = swatch?.image
  const color = swatch?.color

  if (!image && !color) {
    return (
      <div
        className={clsx(
          inStock ? 'cursor-pointer focus:outline-hidden' : 'cursor-not-allowed opacity-25',
          'flex items-center justify-center rounded-md bg-white px-3 py-3 hover:bg-zinc-50 data-focus:ring-offset-2 sm:flex-1',
          isSelected ? 'ring-2 ring-zinc-900' : 'ring-1 ring-zinc-200'
        )}
        title={inStock ? name : 'Out of stock'}
        aria-disabled={!inStock}
        aria-label={name}
      >
        <Text className="font-medium">{name}</Text>
      </div>
    )
  }

  return (
    <div
      className={clsx('h-8 w-8 rounded-full', isSelected && 'ring-2 ring-slate-900 ring-offset-2')}
      style={{
        backgroundColor: color || 'transparent',
      }}
      title={inStock ? name : 'Out of stock'}
      aria-disabled={!inStock}
      aria-label={name}
    >
      {/* {!!image && <Image src={image.src} alt={name} fill className="w-full object-cover" />} */}
    </div>
  )
}
