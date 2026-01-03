'use client'

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Heading } from '@/components/heading'
import { TPackage } from '@/type'
import clsx from 'clsx'
import PricingPdfSection from './pricing-pdf-section'

interface PricingSectionProps {
  packages?: TPackage[]
  pricingPdf?: string
}

export default function PricingSection({ packages, pricingPdf }: PricingSectionProps) {
  const hasPackages = packages && packages.length > 0
  const hasPdf = !!pricingPdf
  const hasBoth = hasPackages && hasPdf

  // Don't render if neither exists
  if (!hasPackages && !hasPdf) {
    return null
  }

  // If only packages, render packages grid directly
  if (hasPackages && !hasPdf) {
    return (
      <section className="space-y-4 sm:space-y-5 lg:space-y-4 xl:space-y-5">
        <Heading level={2} className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-semibold">
          Packages & Pricing
        </Heading>
        <div className="grid gap-4 sm:gap-5 lg:gap-4 xl:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-base sm:text-lg font-semibold text-zinc-900">{pkg.name}</h3>
              {pkg.priceFrom ? (
                <p className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold text-rose-600">From ${pkg.priceFrom}</p>
              ) : null}
              {pkg.description ? (
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-600">{pkg.description}</p>
              ) : null}
              {pkg.features ? (
                <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-zinc-600">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    )
  }

  // If only PDF, render PDF section directly
  if (hasPdf && !hasPackages) {
    return (
      <section className="space-y-4 sm:space-y-5 lg:space-y-4 xl:space-y-5">
        <Heading level={2} className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-semibold">
          Packages & Pricing
        </Heading>
        <PricingPdfSection pdfPath={pricingPdf} />
      </section>
    )
  }

  // If both, render tabs
  return (
    <section className="space-y-4 sm:space-y-5 lg:space-y-4 xl:space-y-5">
      <Heading level={2} className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-semibold">
        Packages & Pricing
      </Heading>
      <TabGroup>
        <TabList className="flex w-full justify-center gap-2 sm:gap-3 lg:gap-4 rounded-full bg-zinc-50 p-1 sm:p-1.5 max-w-md mx-auto">
          <Tab
            className={clsx(
              'w-full rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium transition-all duration-200 focus-visible:outline-none',
              'data-[selected]:bg-zinc-900 data-[selected]:text-white',
              'data-[hover]:bg-zinc-100 data-[selected]:data-[hover]:bg-zinc-900'
            )}
          >
            Packages
          </Tab>
          <Tab
            className={clsx(
              'w-full rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium transition-all duration-200 focus-visible:outline-none',
              'data-[selected]:bg-zinc-900 data-[selected]:text-white',
              'data-[hover]:bg-zinc-100 data-[selected]:data-[hover]:bg-zinc-900'
            )}
          >
            PDF
          </Tab>
        </TabList>
        <TabPanels className="mt-6 sm:mt-7 lg:mt-6 xl:mt-7">
          <TabPanel>
            <div className="grid gap-4 sm:gap-5 lg:gap-4 xl:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {packages?.map((pkg) => (
                <div
                  key={pkg.name}
                  className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm transition hover:shadow-md"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-zinc-900">{pkg.name}</h3>
                  {pkg.priceFrom ? (
                    <p className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold text-rose-600">From ${pkg.priceFrom}</p>
                  ) : null}
                  {pkg.description ? (
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-600">{pkg.description}</p>
                  ) : null}
                  {pkg.features ? (
                    <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-zinc-600">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <svg
                            className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <PricingPdfSection pdfPath={pricingPdf!} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  )
}


