'use client'

import VendorCard from '@/components/vendor-card'
import WeddingDatePicker from '@/components/wedding-date-picker'
import { getVendorCategories, getAllVendors } from '@/data-wedding'
import { useWedding } from '@/lib/wedding-context'
import { Heading } from '@/components/heading'
import { Text, TextLink } from '@/components/text'
import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

export default function ClientDashboard() {
  const categories = getVendorCategories()
  const featured = getAllVendors().filter((v) => v.featured).slice(0, 4)
  const { favorites, favoriteVendors, quotations, weddingInfo } = useWedding()

  const coupleNames =
    [weddingInfo.partnerOne, weddingInfo.partnerTwo].filter(Boolean).join(' & ') || 'Your wedding planner'

  type CountdownState =
    | {
        days: number
        hours: number
        minutes: number
        seconds: number
        label: string
        isToday: boolean
        isPast: boolean
      }
    | null

  const computeCountdown = (dateStr?: string | null): CountdownState => {
    if (!dateStr) return null
    const target = new Date(dateStr)
    const now = new Date()
    const diffMs = target.getTime() - now.getTime()
    if (diffMs < 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        label: 'Date passed',
        isToday: false,
        isPast: true,
      }
    }
    const totalSeconds = Math.floor(diffMs / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const isToday = days === 0
    const label = isToday ? 'Today' : 'Days to go'
    return { days, hours, minutes, seconds, label, isToday, isPast: false }
  }

  const [countdown, setCountdown] = useState<CountdownState>(() => computeCountdown(weddingInfo.weddingDate))

  useEffect(() => {
    setCountdown(computeCountdown(weddingInfo.weddingDate))
    if (!weddingInfo.weddingDate) return
    const id = setInterval(() => {
      setCountdown(computeCountdown(weddingInfo.weddingDate))
    }, 1000)
    return () => clearInterval(id)
  }, [weddingInfo.weddingDate])

  return (
    <div className="bg-gradient-to-b from-[#f4e4e0]/30 via-white to-white pt-8 lg:pt-12">
      <section className="container grid gap-8 py-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center lg:py-16">
        <div className="relative overflow-hidden rounded-3xl bg-[#5a4a42] p-8 text-white shadow-[0_18px_60px_-24px_rgba(90,74,66,0.5)]">
          <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-[#f7e7ce]/30 blur-3xl" aria-hidden />
          <div className="absolute -right-12 -bottom-14 h-40 w-40 rounded-full bg-[#d4a5a5]/20 blur-3xl" aria-hidden />
          <div className="relative space-y-3">
            <p className="text-sm uppercase tracking-wide text-[#f4e4e0]">Your wedding planner</p>
            <Heading level={1} className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {coupleNames}
            </Heading>
            <Text className="text-base text-[#f9f4ef]/90">
              Track your date, shortlist vendors, and manage quotation requests—all in one calm workspace.
            </Text>
            {countdown ? (
              <div className="inline-flex flex-wrap items-center gap-3 rounded-full bg-[#5a4a42]/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold leading-none tabular-nums text-[#f7e7ce]">{countdown.days}</span>
                  <span className="text-[11px] uppercase tracking-wide text-[#f4e4e0]/80">days</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold leading-none tabular-nums text-[#f7e7ce]">{countdown.hours}</span>
                  <span className="text-[11px] uppercase tracking-wide text-[#f4e4e0]/80">h</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold leading-none tabular-nums text-[#f7e7ce]">{countdown.minutes}</span>
                  <span className="text-[11px] uppercase tracking-wide text-[#f4e4e0]/80">m</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold leading-none tabular-nums text-[#f7e7ce]">{countdown.seconds}</span>
                  <span className="text-[11px] uppercase tracking-wide text-[#f4e4e0]/80">s</span>
                </div>
                <span className="text-[11px] uppercase tracking-wide text-[#f4e4e0]/80">
                  {countdown.isPast ? 'Date passed' : countdown.isToday ? "Today's the day" : ''}
                </span>
              </div>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Badge label={`${favorites.length} favorites`} tone="light" />
              <Badge label={`${quotations.length} quotes`} tone="light" />
              <Badge label={`${favoriteVendors.length} shortlisted vendors`} tone="light" />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <CTAButton href="/collections/all" variant="light">
                Find vendors
              </CTAButton>
              <CTAButton href="/favorites" variant="ghost">
                View favorites
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="overflow-hidden rounded-3xl border border-[#d4a5a5]/30 bg-white/90 p-4 shadow-[0_12px_40px_-24px_rgba(212,165,165,0.2)] backdrop-blur">
            <WeddingDatePicker className="bg-white" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Favorites', value: favorites.length, color: 'from-[#f4e4e0]/50 to-[#d4a5a5]/30 text-[#5a4a42]' },
              { label: 'Quotes', value: quotations.length, color: 'from-[#f7e7ce]/40 to-[#c9a58a]/30 text-[#5a4a42]' },
              { label: 'Vendors', value: favoriteVendors.length, color: 'from-[#d4a5a5]/30 to-[#f4e4e0]/50 text-[#5a4a42]' },
            ].map((item) => (
              <div
                key={item.label}
                className={clsx(
                  'rounded-2xl bg-gradient-to-br p-3 text-center text-sm font-semibold shadow-sm',
                  item.color
                )}
              >
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-xs uppercase tracking-wide opacity-80">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-[#d4a5a5]/30 bg-white shadow-[0_12px_40px_-24px_rgba(212,165,165,0.15)]">
            <div className="aspect-[16/9]">
              <Image
                src="/images/fashion/p6-1.jpg"
                alt="Wedding inspiration"
                width={1280}
                height={720}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 540px"
                priority={false}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#5a4a42]/40 via-[#5a4a42]/5 to-transparent" />
          </div>
        </div>
      </section>

      <section className="container mt-6 space-y-4 pb-12">
        <div className="flex items-center justify-between">
          <Heading level={2} className="text-2xl font-semibold text-[#5a4a42]">
            Explore categories
          </Heading>
          <TextLink href="/collections/all" className="text-sm font-semibold text-[#d4a5a5]">
            View all
          </TextLink>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className={clsx(
                'rounded-xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg',
                'border-[#d4a5a5]/30 bg-white',
                idx % 3 === 0 && 'bg-gradient-to-br from-[#f4e4e0]/30 to-white',
                idx % 3 === 1 && 'bg-gradient-to-br from-[#f7e7ce]/20 to-white',
                idx % 3 === 2 && 'bg-gradient-to-br from-[#d4a5a5]/15 to-white'
              )}
            >
              <Text className="text-xs uppercase text-[#d4a5a5]">{cat.subcategories.length} subcategories</Text>
              <Heading level={3} className="text-lg font-semibold text-[#5a4a42]">
                {cat.name}
              </Heading>
              <Text className="mt-1 text-sm text-zinc-600">{cat.description}</Text>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-600">
                {cat.subcategories.slice(0, 3).map((s) => (
                  <span key={s.id} className="rounded-full bg-[#f4e4e0]/50 px-3 py-1 capitalize text-[#5a4a42] shadow-sm">
                    {s.name}
                  </span>
                ))}
              </div>
              <TextLink href={`/collections/${cat.slug}`} className="mt-4 inline-block text-sm font-semibold text-[#c9a58a]">
                Browse vendors
              </TextLink>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#f4e4e0]/20 via-white to-[#f7e7ce]/15 py-12">
        <div className="container space-y-4">
          <div className="flex items-center justify-between">
            <Heading level={2} className="text-2xl font-semibold text-[#5a4a42]">
              Featured vendors
            </Heading>
            <TextLink href="/collections/all" className="text-sm font-semibold text-[#d4a5a5]">
              Explore more
            </TextLink>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Badge({ label, tone = 'light' }: { label: string; tone?: 'light' | 'dark' }) {
  return (
    <span
      className={clsx(
        'rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
        tone === 'light'
          ? 'bg-white/80 text-[#5a4a42]'
          : 'bg-[#f4e4e0]/50 text-[#5a4a42]'
      )}
    >
      {label}
    </span>
  )
}

function CTAButton({
  href,
  children,
  variant = 'light',
}: {
  href: string
  children: React.ReactNode
  variant?: 'light' | 'ghost'
}) {
  return (
    <TextLink
      href={href}
      className={clsx(
        'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition',
        variant === 'light'
          ? 'bg-white text-[#5a4a42] shadow-sm hover:bg-[#f4e4e0]/70'
          : 'border border-white/50 text-white hover:bg-white/10'
      )}
    >
      {children}
    </TextLink>
  )
}

