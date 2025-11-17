'use client'

import { ShoppingBag03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useAside } from '../aside'

const CartIconBtn = () => {
  const { open: openAside } = useAside()
  return (
    <button
      type="button"
      className="-m-2.5 inline-flex cursor-pointer items-center justify-center rounded-md p-2.5"
      onClick={() => openAside('cart')}
    >
      <HugeiconsIcon icon={ShoppingBag03Icon} size={24} color="currentColor" strokeWidth={1} />
      <span className="text-xs leading-none">(3)</span>
    </button>
  )
}

export default CartIconBtn
