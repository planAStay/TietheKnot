'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { TImage } from '@/type'
import clsx from 'clsx'

interface VendorHeroCarouselProps {
  images: TImage[]
  className?: string
}

export default function VendorHeroCarousel({ images, className }: VendorHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Combine hero image with gallery images
  const allImages = images.length > 0 ? images : []

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play with pause on hover
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (allImages.length <= 1 || isPaused) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [allImages.length, isPaused])

  if (allImages.length === 0) {
    return null
  }

  return (
    <div
      className={clsx('relative w-full', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Carousel Container */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[16/9] lg:aspect-[16/9] w-full max-h-[400px] sm:max-h-[450px] md:max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] overflow-hidden rounded-lg sm:rounded-xl shadow-lg">
        {/* Images */}
        <div className="relative h-full w-full">
          {allImages.map((image, index) => (
            <div
              key={index}
              className={clsx(
                'absolute inset-0 transition-opacity duration-500 ease-in-out',
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                quality={90}
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all touch-manipulation"
              aria-label="Previous image"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-zinc-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all touch-manipulation"
              aria-label="Next image"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-zinc-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute top-2.5 sm:top-3 md:top-4 right-2.5 sm:right-3 md:right-4 z-20 bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5">
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-white">
              {currentIndex + 1}/{allImages.length}
            </span>
          </div>
        )}

        {/* Pagination Dots */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2.5 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1.5 sm:px-3 sm:py-2">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={clsx(
                  'transition-all duration-300 rounded-full touch-manipulation',
                  index === currentIndex
                    ? 'h-1.5 w-6 sm:h-2 sm:w-8 md:h-2.5 md:w-10 bg-white'
                    : 'h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 bg-white/60 hover:bg-white/80'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

