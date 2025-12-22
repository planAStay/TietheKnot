import { Heading } from '@/components/heading'
import { Text, TextLink } from '@/components/text'
import WeddingDatePill from '@/components/header/wedding-date-pill'
import VendorCard from '@/components/vendor-card'
import { getAllVendors, getVendorCategories } from '@/data-wedding'
import clsx from 'clsx'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 0

export default function LandingPage() {
  const categories = getVendorCategories().slice(0, 6)
  const featured = getAllVendors().filter((v) => v.featured).slice(0, 6)

  return (
    <div className="bg-gradient-to-b from-[#f4e4e0]/30 via-[#fdfbf7] to-white">
      {/* Hero */}
      <section className="container grid gap-10 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f4e4e0]/50 px-4 py-2 ring-1 ring-[#d4a5a5]/20">
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[#d4a5a5] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4a5a5]"></span>
            </span>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#d4a5a5]">Plan Your Dream Wedding</p>
          </div>
          <Heading level={1} className="text-5xl font-bold leading-tight text-[#5a4a42] sm:text-6xl lg:text-7xl">
            Every moment,<br />
            <span className="bg-gradient-to-r from-[#d4a5a5] via-[#c9a58a] to-[#d4a5a5] bg-clip-text text-transparent">
              Every detail,
            </span><br />
            Perfectly planned.
          </Heading>
          <Text className="text-xl leading-relaxed text-zinc-600">
            Discover vetted vendors, save favorites, and request quotes in one elegant workspace. Start planning your perfect day—no login required.
          </Text>
          <div className="flex flex-wrap gap-3">
            <CTAButton href="/collections/all" variant="primary">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Vendors
            </CTAButton>
            <CTAButton href="/home-fashion" variant="ghost">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Start Planning
            </CTAButton>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-4">
            {[
              { value: '500+', label: 'Trusted Vendors' },
              { value: '1,200+', label: 'Happy Couples' },
              { value: '15+', label: 'Categories' },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="text-3xl font-bold text-[#d4a5a5]">{stat.value}</div>
                <div className="text-sm text-zinc-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <WeddingDatePill compact={false} />
          </div>
        </div>
        
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#d4a5a5]/20 blur-3xl" aria-hidden />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-[#f7e7ce]/30 blur-3xl" aria-hidden />
          
          <div className="relative rounded-3xl bg-white p-8 shadow-[0_18px_60px_-24px_rgba(212,165,165,0.25)] ring-1 ring-[#d4a5a5]/30">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Heading level={3} className="text-2xl font-semibold text-[#5a4a42]">
                    Featured Vendors
                  </Heading>
                  <Text className="text-sm text-zinc-600">Curated picks to jumpstart your search</Text>
                </div>
                <div className="rounded-full bg-[#f4e4e0] p-3">
                  <svg className="h-6 w-6 text-[#d4a5a5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {featured.slice(0, 4).map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5a4a42] via-[#6b5b52] to-[#5a4a42] px-8 py-16 text-white shadow-[0_18px_60px_-24px_rgba(90,74,66,0.5)]">
          {/* Decorative elements */}
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#d4a5a5]/10 blur-3xl" aria-hidden />
          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#f7e7ce]/10 blur-3xl" aria-hidden />
          
          <div className="relative">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                <svg className="h-5 w-5 text-[#f7e7ce]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-semibold uppercase tracking-wide text-[#f4e4e0]">Streamlined Planning</span>
              </div>
              <Heading level={2} className="text-4xl font-bold text-white sm:text-5xl">
                From shortlists to booked—<br />one guided path.
              </Heading>
              <Text className="mx-auto mt-4 max-w-2xl text-lg text-[#f9f4ef]/90">
                Save favorites, request quotes, and track availability without losing the magic. Everything you need in one beautiful workspace.
              </Text>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <CTAButton href="/favorites" variant="light">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                  View Favorites
                </CTAButton>
                <CTAButton href="/quotations" variant="ghost">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  My Quotes
                </CTAButton>
              </div>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: (
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ),
                  title: 'Shortlist Fast',
                  desc: 'Tap the heart to save vendors you love across any category. Build your dream team effortlessly.',
                },
                {
                  icon: (
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  ),
                  title: 'Request Quotes',
                  desc: 'Send one-click quote requests with your date and guest count. Get responses from multiple vendors.',
                },
                {
                  icon: (
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  ),
                  title: 'Stay Organized',
                  desc: 'See favorites and quotes in dedicated pages—no spreadsheets needed. Track everything in one place.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-300 hover:bg-white/10 hover:scale-105"
                >
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#d4a5a5]/10 blur-2xl transition-all duration-500 group-hover:scale-150" aria-hidden />
                  <div className="relative">
                    <div className="mb-4 inline-flex rounded-xl bg-[#f7e7ce]/20 p-3 text-[#f7e7ce]">
                      {item.icon}
                    </div>
                    <p className="mb-2 text-lg font-semibold text-white">{item.title}</p>
                    <Text className="text-sm leading-relaxed text-[#f9f4ef]/80">{item.desc}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-wide text-[#d4a5a5]">Love Stories</p>
          <Heading level={2} className="mt-2 text-3xl font-semibold text-[#5a4a42] sm:text-4xl">
            Hear from happy couples
          </Heading>
          <Text className="mt-3 text-zinc-600">
            Join thousands of couples who planned their perfect day with TieTheKnot
          </Text>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              quote: "TieTheKnot made planning so much easier! We found our dream photographer and venue all in one place. Couldn't be happier!",
              author: 'Sarah & Michael',
              date: 'Married June 2024',
              rating: 5,
            },
            {
              quote: "The quote request feature saved us hours. We got responses from 5 vendors within 24 hours. Highly recommend!",
              author: 'Emily & James',
              date: 'Married August 2024',
              rating: 5,
            },
            {
              quote: "Best wedding planning tool we used. The countdown feature kept us organized and the vendor quality was top-notch!",
              author: 'Lisa & David',
              date: 'Married September 2024',
              rating: 5,
            },
          ].map((testimonial, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-[#d4a5a5]/20 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f4e4e0]/40 blur-2xl transition-all duration-500 group-hover:scale-150" aria-hidden />
              <div className="relative">
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-[#d4a5a5]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <Text className="mb-4 text-zinc-700 italic leading-relaxed">"{testimonial.quote}"</Text>
                <div className="border-t border-[#d4a5a5]/20 pt-4">
                  <p className="font-semibold text-[#5a4a42]">{testimonial.author}</p>
                  <p className="text-sm text-zinc-500">{testimonial.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: We'll walk through every part of planning */}
      <section className="container py-12 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-wide text-[#d4a5a5]">Complete Wedding Toolkit</p>
          <Heading level={2} className="mt-2 text-3xl font-semibold text-[#5a4a42] sm:text-4xl">
            Guidance and tools that keep you calm
          </Heading>
          <Text className="mx-auto mt-3 max-w-2xl text-lg text-zinc-600">
            A lightweight workspace that highlights your date, vendors, and progress. Everything synced beautifully.
          </Text>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
              title: 'Date-first Design',
              desc: 'Your wedding date stays visible across the experience with a gentle countdown. Never lose sight of your big day.',
              gradient: 'from-[#f4e4e0]/30 to-white',
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              title: 'Vendor Visibility',
              desc: 'Category pages showcase curated vendors with quick-save hearts. Browse by style, location, or budget.',
              gradient: 'from-[#f7e7ce]/20 to-white',
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              title: 'Quote Clarity',
              desc: 'All quote requests live together so you never miss a reply. Track status, compare prices, and book with confidence.',
              gradient: 'from-[#d4a5a5]/15 to-white',
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Timeline Tracking',
              desc: 'Stay on schedule with smart reminders and milestone tracking. Know exactly what to do and when.',
              gradient: 'from-[#e8c4b8]/20 to-white',
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: 'Budget Management',
              desc: 'Keep track of estimated costs and actual spending. Filter vendors by price range to stay within budget.',
              gradient: 'from-[#c9a58a]/15 to-white',
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ),
              title: 'Mobile Ready',
              desc: 'Plan on the go with our responsive design. Access your favorites and quotes from any device, anywhere.',
              gradient: 'from-[#dcc9ba]/20 to-white',
            },
          ].map((item, idx) => (
            <div
              key={item.title}
              className={clsx(
                'group relative overflow-hidden rounded-2xl border border-[#d4a5a5]/30 bg-gradient-to-br p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
                item.gradient
              )}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#d4a5a5]/10 blur-2xl transition-all duration-500 group-hover:scale-150" aria-hidden />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-white p-3 text-[#d4a5a5] shadow-sm ring-1 ring-[#d4a5a5]/20">
                  {item.icon}
                </div>
                <p className="mb-2 text-lg font-semibold text-[#5a4a42]">{item.title}</p>
                <Text className="text-sm leading-relaxed text-zinc-600">{item.desc}</Text>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <CTAButton href="/home-fashion" variant="primary">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Open Wedding Planner
          </CTAButton>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f4e4e0] via-white to-[#f7e7ce]/50 px-8 py-16 text-center shadow-2xl ring-1 ring-[#d4a5a5]/20 sm:px-16 sm:py-20">
          {/* Decorative elements */}
          <div className="absolute left-0 top-0 h-full w-full">
            <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-[#d4a5a5]/20 blur-3xl" aria-hidden />
            <div className="absolute right-10 bottom-10 h-40 w-40 rounded-full bg-[#f7e7ce]/40 blur-3xl" aria-hidden />
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-3xl" aria-hidden />
          </div>

          <div className="relative mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm ring-1 ring-[#d4a5a5]/20 backdrop-blur">
              <svg className="h-5 w-5 text-[#d4a5a5]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-[#5a4a42]">Ready to start?</span>
            </div>
            
            <Heading level={2} className="text-4xl font-bold text-[#5a4a42] sm:text-5xl lg:text-6xl">
              Begin your journey to<br />
              <span className="bg-gradient-to-r from-[#d4a5a5] via-[#c9a58a] to-[#d4a5a5] bg-clip-text text-transparent">
                "I do"
              </span>
            </Heading>
            
            <Text className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-zinc-600">
              Join thousands of couples planning their perfect wedding. No credit card required. Start exploring vendors today.
            </Text>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <CTAButton href="/collections/all" variant="primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse All Vendors
              </CTAButton>
              <CTAButton href="/home-fashion" variant="ghost">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create My Wedding
              </CTAButton>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-zinc-600">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[#d4a5a5]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No login required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[#d4a5a5]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[#d4a5a5]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Vetted vendors</span>
              </div>
            </div>
          </div>
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
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/40 focus:ring-offset-2'
  const styles =
    variant === 'primary'
      ? 'bg-[#d4a5a5] text-white hover:bg-[#b88a8a] hover:shadow-lg hover:scale-105'
      : variant === 'light'
        ? 'border-2 border-white/40 bg-white/15 text-white hover:bg-white/25 hover:border-white/60 backdrop-blur'
        : 'border-2 border-[#d4a5a5]/30 bg-white text-[#5a4a42] hover:bg-[#f4e4e0]/40 hover:border-[#d4a5a5]/50 hover:shadow-md'
  return (
    <Link href={href} className={clsx(base, styles)}>
      {children}
    </Link>
  )
}

