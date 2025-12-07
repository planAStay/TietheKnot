import { Heading } from '@/components/heading'
import clsx from 'clsx'
import Image from 'next/image'

interface ProductDetailContentProps {
  className?: string
  content: string
  imageSrc?: string
  imageAlt?: string
}

const ProductDetailContent = ({ content, className, imageAlt, imageSrc }: ProductDetailContentProps) => {
  return (
    <div className={clsx('max-w-none', className)}>
      <div className="flex flex-col-reverse justify-between gap-14 lg:flex-row lg:gap-12 xl:gap-20 2xl:gap-32">
        <div className="flex flex-3/7">
          <Image
            src={imageSrc || '/images/hijab/feature-1-2.png'}
            width={494}
            height={529}
            alt={imageAlt || 'product-detail-content'}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            className="w-full object-cover"
          />
        </div>

        <div className="flex flex-4/7 flex-col gap-5 lg:gap-10 2xl:gap-14">
          <Heading>
            <span>Details &</span>
            <br />
            <span data-slot="italic">features</span>
          </Heading>

          <div
            className="max-w-xl leading-relaxed"
            // dangerouslySetInnerHTML={{ __html: content }}
          >
            {/* this is demo -- you need to use the dangerouslySetInnerHTML={{ __html: content }} */}
            <div className="space-y-8">
              <div>
                <p>
                  Jersey Hijabs are unbelievably lightweight. We‘ve spent months designing the perfect fabric that keeps
                  you cool and comfortable with our all-season lightweight bamboo jersey hijab. Its breathable fabric is
                  perfect for any occasion from weddings to going to the gym - this is our must-have fabric that will
                  keep your hijab in place and looking chic all day.
                </p>
              </div>
              <div>
                <p className="mb-3 text-sm text-zinc-500 uppercase">Product Details</p>
                <ul className="list-inside list-disc *:marker:text-zinc-300">
                  <li>200x70 cm is our Regular Modal Hijab Size.</li>
                  <li>Two-piece set includes a hijab and matching undercap.</li>
                  <li>Made from 100% TENCEL™ Modal fabric.</li>
                  <li>Perfect for layering or wearing alone.</li>
                  <li>Easy to care for and maintain.</li>
                </ul>
              </div>
              <div>
                <p className="mb-3 text-sm text-zinc-500 uppercase">Product Features</p>
                <ul className="list-inside list-disc *:marker:text-zinc-300">
                  <li>The fabric allows air circulation, keeping you cool and comfortable.</li>
                  <li>Lightweight and breathable, perfect for all-day wear.</li>
                  <li>Soft and smooth texture, providing a luxurious feel against the skin.</li>
                  <li>Versatile design that can be styled in various ways to suit your look.</li>
                  <li>Available in a range of colors to match any outfit or occasion.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailContent
