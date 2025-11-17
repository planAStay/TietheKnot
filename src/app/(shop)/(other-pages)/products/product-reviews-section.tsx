import { getProductReviews } from '@/data'
import { StarIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

interface ProductReviewSectionProps {
  className?: string
  reviews: Awaited<ReturnType<typeof getProductReviews>>
}

export default function ProductReviewSection({ reviews, className }: ProductReviewSectionProps) {
  return (
    <div className={className}>
      <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
        <h2 className="text-lg font-medium text-zinc-900">{reviews.length} Reviews</h2>
        <div className="mt-6 divide-y divide-zinc-900/10 border-t border-b border-zinc-900/10">
          {reviews.map((review) => (
            <div key={review.id} className="py-10 lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8">
                <div className="flex items-center xl:col-span-1">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={clsx(
                          review.rating > rating ? 'text-yellow-400' : 'text-zinc-200',
                          'size-5 shrink-0'
                        )}
                      />
                    ))}
                  </div>
                  <p className="ml-3 text-sm text-zinc-700">
                    {review.rating}
                    <span className="sr-only"> out of 5 stars</span>
                  </p>
                </div>

                <div className="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
                  <h3 className="text-sm font-medium text-zinc-900">{review.title}</h3>

                  <div
                    dangerouslySetInnerHTML={{ __html: review.content }}
                    className="mt-3 space-y-6 text-sm text-zinc-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3">
                <p className="font-medium text-zinc-900 capitalize">{review.author}</p>
                <time
                  dateTime={review.datetime}
                  className="ml-4 border-l border-zinc-200 pl-4 text-zinc-500 lg:mt-2 lg:ml-0 lg:border-0 lg:pl-0"
                >
                  {review.date}
                </time>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
