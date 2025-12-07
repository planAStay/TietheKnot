import { CartProductItem } from '@/components/aside-sidebar-cart'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Description, Field, Fieldset, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Radio, RadioGroup } from '@/components/radio'
import { Select } from '@/components/select'
import { getCartProducts } from '@/data'
import { Metadata } from 'next'
import Link from 'next/link'
import DeliveryRadio from './delivery-radio'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Your checkout page description goes here.',
  keywords: ['checkout', 'shopping cart', 'ecommerce'],
}

export default async function Page() {
  const products = await getCartProducts()

  return (
    <div className="container">
      <div className="mx-auto max-w-7xl pt-16 pb-24">
        <h2 className="sr-only">Checkout</h2>

        <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16 2xl:gap-x-20">
          <div>
            {/* Contact */}
            <div>
              <Heading fontSize="text-2xl font-medium text-zinc-950" level={3}>
                <span data-slot="italic">Contact</span> information
              </Heading>

              <Field className="mt-10">
                <Label>Email address</Label>
                <Input type="email" name="email" />
                <Description>We’ll send you a confirmation email when your order has shipped.</Description>
              </Field>
            </div>

            {/* Shipping */}
            <div className="mt-10 border-t border-zinc-200 pt-10">
              <Heading fontSize="text-2xl font-medium text-zinc-950" level={3}>
                <span data-slot="italic">Shipping</span> information
              </Heading>
              <div className="mt-10 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <Field>
                  <Label>Fisrt name</Label>
                  <Input type="text" name="fisrt-name" />
                </Field>

                <Field>
                  <Label>Last name</Label>
                  <Input type="text" name="last-name" />
                </Field>

                <Field className="sm:col-span-2">
                  <Label>Last name</Label>
                  <Input type="text" name="company" />
                </Field>

                <Field className="sm:col-span-2">
                  <Label>Address</Label>
                  <Input type="text" name="address" />
                </Field>

                <Field className="sm:col-span-2">
                  <Label>Apartment, suite, etc.</Label>
                  <Input type="text" name="apartment" />
                </Field>

                <Field>
                  <Label>City</Label>
                  <Input type="text" name="city" />
                </Field>

                <Field>
                  <Label>Country</Label>
                  <Select className="mt-3 sm:col-span-2 sm:mt-0" name="country">
                    <option>Canada</option>
                    <option>Mexico</option>
                    <option>United States</option>
                  </Select>
                </Field>

                <Field>
                  <Label>State / Province</Label>
                  <Input type="text" name="region" />
                </Field>

                <Field>
                  <Label>Postal code</Label>
                  <Input type="text" name="postal-code" />
                </Field>

                <Field className="sm:col-span-2">
                  <Label>Phone</Label>
                  <Input type="phone" name="phone" />
                </Field>
              </div>
            </div>

            {/* Delivery */}
            <div className="mt-10 border-t border-zinc-200 pt-10">
              <Fieldset>
                <Heading fontSize="text-2xl font-medium text-zinc-950" level={3}>
                  <span data-slot="italic">Delivery</span> method
                </Heading>

                <DeliveryRadio />
              </Fieldset>
            </div>

            {/* Payment */}
            <div className="mt-10 border-t border-zinc-200 pt-10">
              <Heading fontSize="text-2xl font-medium text-zinc-950" level={3}>
                <span data-slot="italic">Payment</span> method
              </Heading>

              <Fieldset className="mt-4">
                <legend className="sr-only">Payment type</legend>

                <RadioGroup
                  name="payment-type"
                  defaultValue="PayPal"
                  className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10"
                >
                  <Field className="flex items-center gap-x-3">
                    <Radio value="Credit" />
                    <Label>Credit card</Label>
                  </Field>
                  <Field className="flex items-center gap-x-3">
                    <Radio value="PayPal" />
                    <Label>PayPal</Label>
                  </Field>
                  <Field className="flex items-center gap-x-3">
                    <Radio value="eTransfer" />
                    <Label>eTransfer</Label>
                  </Field>
                </RadioGroup>
              </Fieldset>

              <div className="mt-8 grid grid-cols-4 gap-x-4 gap-y-6">
                <Field className="col-span-4">
                  <Label>Card number</Label>
                  <Input type="text" name="card-number" autoComplete="cc-number" />
                </Field>
                <Field className="col-span-4">
                  <Label>Name on card</Label>
                  <Input type="text" name="name-on-card" autoComplete="cc-name" />
                </Field>
                <Field className="col-span-3">
                  <Label>Expiration date (MM/YY)</Label>
                  <Input type="text" name="expiration-date" autoComplete="cc-exp" />
                </Field>
                <Field>
                  <Label>CVC</Label>
                  <Input type="text" name="cvc" autoComplete="csc" />
                </Field>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <Heading fontSize="text-2xl font-medium text-zinc-950" level={3}>
              <span data-slot="italic">Order</span> summary
            </Heading>

            <div className="mt-5 rounded-lg border border-zinc-200 bg-white">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-zinc-200">
                {products.map((product) => (
                  <CartProductItem key={product.id} product={product} className="px-4 py-6 sm:px-6" />
                ))}
              </ul>
              <dl className="space-y-6 border-t border-zinc-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm uppercase">Subtotal</dt>
                  <dd className="text-sm font-medium text-zinc-900">$64.00</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm uppercase">Shipping</dt>
                  <dd className="text-sm font-medium text-zinc-900">$5.00</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm uppercase">Taxes</dt>
                  <dd className="text-sm font-medium text-zinc-900">$5.52</dd>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 pt-6">
                  <dt className="text-base font-medium uppercase">Total</dt>
                  <dd className="text-base font-medium text-zinc-900">$75.52</dd>
                </div>
              </dl>

              <div className="border-t border-zinc-200 px-4 py-6 sm:px-6">
                <Button className="w-full font-medium" type="submit" href={'/order-successful'}>
                  Confirm order
                </Button>
                <div className="mt-4 flex justify-center text-center text-sm text-zinc-500">
                  <span className="text-xs">
                    or{' '}
                    <span className="text-xs font-medium text-zinc-900 uppercase">
                      <Link href="/collections/all">Continue Shopping</Link>
                      <span aria-hidden="true"> →</span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Divider />
    </div>
  )
}
