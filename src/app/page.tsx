import { Heading } from '@/components/heading'
import { Text, TextLink } from '@/components/text'
import WeddingDatePill from '@/components/header/wedding-date-pill'
import VendorCard from '@/components/vendor-card'
import { getAllVendors, getVendorCategories } from '@/data-wedding'
import clsx from 'clsx'
import Link from 'next/link'

export const revalidate = 0

export default function LandingPage() {
  const categories = getVendorCategories().slice(0, 6)
  const featured = getAllVendors().filter((v) => v.featured).slice(0, 3)

  return (
    <div className="bg-gradient-to-b from-[#f4e4e0]/30 via-[#fdfbf7] to-white">
      {/* Hero */}
      <section className="container grid gap-10 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-[#d4a5a5]">TieTheKnot</p>
          <Heading level={1} className="text-4xl font-semibold leading-tight text-[#5a4a42] sm:text-5xl">
            Plan a wedding that feels like you—every moment, every detail.
          </Heading>
          <Text className="text-lg text-zinc-600">
            Discover vetted vendors, save favorites, and request quotes in one elegant workspace. No log in required to
            start exploring.
          </Text>
          <div className="flex flex-wrap gap-3">
            <CTAButton href="/collections/all" variant="primary">
              Find vendors
            </CTAButton>
            <CTAButton href="/home-fashion" variant="ghost">
              Start planning
            </CTAButton>
          </div>
          <div className="mt-3">
            <WeddingDatePill compact={false} />
          </div>
        </div>
        <div className="relative rounded-3xl bg-white p-8 shadow-[0_18px_60px_-24px_rgba(212,165,165,0.25)] ring-1 ring-[#d4a5a5]/30">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#d4a5a5]/30 blur-3xl" aria-hidden />
          <div className="absolute -left-6 -bottom-8 h-24 w-24 rounded-full bg-[#f7e7ce]/40 blur-3xl" aria-hidden />
          <div className="space-y-4">
            <Heading level={3} className="text-2xl font-semibold text-[#5a4a42]">
              Your vendor shortlist
            </Heading>
            <Text className="text-sm text-zinc-600">Curated picks to jumpstart your search.</Text>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {featured.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Find vendors for every vibe */}
      <section className="container py-12 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase text-[#d4a5a5]">Find vendors for every vibe</p>
            <Heading level={2} className="text-3xl font-semibold text-[#5a4a42]">
              Whatever your style, we have the team.
            </Heading>
            <Text className="mt-1 text-zinc-600">
              From seaside sunsets to city soirées, explore categories that match your day.
            </Text>
          </div>
          <TextLink href="/collections/all" className="text-sm font-semibold text-[#d4a5a5]">
            Browse all categories
          </TextLink>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className="group relative overflow-hidden rounded-3xl border-2 border-[#d4a5a5]/20 bg-gradient-to-br from-white via-[#f4e4e0]/10 to-[#d4a5a5]/10 p-6 shadow-[0_8px_30px_rgba(212,165,165,0.08)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#d4a5a5]/50 hover:shadow-[0_20px_60px_rgba(212,165,165,0.18)]"
            >
              {/* Decorative corner flourish */}
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-[#d4a5a5]/25 via-[#f7e7ce]/20 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
              <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-[#f4e4e0]/20 blur-xl transition-all duration-500 group-hover:scale-150 group-hover:bg-[#d4a5a5]/25" aria-hidden />
              
              {/* Elegant top accent line */}
              <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#d4a5a5] via-[#e8c4b8] to-[#d4a5a5] transition-all duration-700 group-hover:w-full" aria-hidden />
              
              {/* Category icon placeholder - decorative element */}
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#d4a5a5]/20 to-[#f7e7ce]/20 shadow-inner ring-1 ring-[#d4a5a5]/30 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:ring-[#d4a5a5]/50">
                <svg className="h-6 w-6 text-[#d4a5a5] transition-transform duration-500 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>

              <div className="relative">
                {/* Options badge */}
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#d4a5a5]/15 to-[#f7e7ce]/15 px-3 py-1 ring-1 ring-[#d4a5a5]/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d4a5a5] transition-all duration-300 group-hover:animate-pulse" />
                  <Text className="text-xs font-medium uppercase tracking-wider text-[#d4a5a5]">
                    {cat.subcategories.length} options
                  </Text>
                </div>

                {/* Title */}
                <Heading level={3} className="mb-2 text-2xl font-semibold leading-tight text-[#5a4a42] transition-colors duration-300 group-hover:text-[#d4a5a5]">
                  {cat.name}
                </Heading>

                {/* Description */}
                <Text className="mb-4 text-sm leading-relaxed text-zinc-600 transition-colors duration-300 group-hover:text-zinc-700">
                  {cat.description}
                </Text>

                {/* Subcategories tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {cat.subcategories.slice(0, 4).map((s) => (
                    <span 
                      key={s.id} 
                      className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium capitalize text-[#5a4a42]/70 shadow-sm ring-1 ring-[#d4a5a5]/25 transition-all duration-300 group-hover:bg-[#f4e4e0]/50 group-hover:text-[#d4a5a5] group-hover:ring-[#d4a5a5]/40"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>

                {/* CTA with arrow */}
                <div className="flex items-center gap-2 text-sm font-semibold text-[#d4a5a5] transition-all duration-300 group-hover:gap-3 group-hover:text-[#b88a8a]">
                  <span>View vendors</span>
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Decorative corner element - bottom right */}
              <div className="absolute -bottom-2 -right-2 h-16 w-16 opacity-5 transition-all duration-500 group-hover:opacity-10" aria-hidden>
                <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#d4a5a5]">
                  <path d="M50,10 Q90,50 50,90 Q10,50 50,10" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section: Build your vendor team */}
      <section className="container py-12 sm:py-16">
        <div className="rounded-3xl bg-[#5a4a42] px-8 py-12 text-white shadow-[0_18px_60px_-24px_rgba(90,74,66,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase text-[#f4e4e0]">Build your vendor team</p>
              <Heading level={2} className="text-3xl font-semibold text-white">
                From shortlists to booked—one guided path.
              </Heading>
              <Text className="mt-2 text-[#f9f4ef]">
                Save favorites, request quotes, and track availability without losing the magic.
              </Text>
            </div>
            <CTAButton href="/favorites" variant="light">
              View favorites
            </CTAButton>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Shortlist fast', desc: 'Tap the heart to save vendors you love across any category.' },
              { title: 'Request quotes', desc: 'Send one-click quote requests with your date and guest count.' },
              { title: 'Stay organized', desc: 'See favorites and quotes in dedicated pages—no spreadsheets needed.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-[#d4a5a5]/30 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm uppercase text-[#f7e7ce]">{item.title}</p>
                <Text className="mt-2 text-sm text-[#f9f4ef]">{item.desc}</Text>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: We'll walk through every part of planning */}
      <section className="container py-12 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase text-[#d4a5a5]">We'll walk through every part of planning</p>
            <Heading level={2} className="text-3xl font-semibold text-[#5a4a42]">
              Guidance and tools that keep you calm.
            </Heading>
            <Text className="mt-1 text-zinc-600">
              A lightweight workspace that highlights your date, vendors, and progress.
            </Text>
          </div>
          <CTAButton href="/home-fashion" variant="primary">
            Open planner
          </CTAButton>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: 'Date-first design',
              desc: 'Your wedding date stays visible across the experience with a gentle countdown.',
            },
            { title: 'Vendor visibility', desc: 'Category pages showcase curated vendors with quick-save hearts.' },
            { title: 'Quote clarity', desc: 'All quote requests live together so you never miss a reply.' },
          ].map((item, idx) => (
            <div
              key={item.title}
              className={clsx(
                'rounded-2xl border border-[#d4a5a5]/30 bg-white p-5 shadow-sm',
                idx === 0 && 'bg-gradient-to-br from-[#f4e4e0]/30 to-white',
                idx === 1 && 'bg-gradient-to-br from-[#f7e7ce]/20 to-white',
                idx === 2 && 'bg-gradient-to-br from-[#d4a5a5]/15 to-white'
              )}
            >
              <p className="text-sm uppercase text-[#d4a5a5]">{item.title}</p>
              <Text className="mt-2 text-sm text-zinc-600">{item.desc}</Text>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function CTAButton({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'light'
}) {
  const base =
    'inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/40'
  const styles =
    variant === 'primary'
      ? 'bg-[#d4a5a5] text-white hover:bg-[#b88a8a]'
      : variant === 'light'
        ? 'border border-white/40 bg-white/15 text-white hover:bg-white/25'
        : 'border border-[#d4a5a5]/30 bg-white text-[#5a4a42] hover:bg-[#f4e4e0]/40'
  return (
    <Link href={href} className={clsx(base, styles)}>
      {children}
    </Link>
  )
}

