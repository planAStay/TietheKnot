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
    <div className="bg-gradient-to-b from-[#DDDED9]/20 via-white to-white">
      {/* Hero */}
      <section className="container grid gap-10 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-[#E4BC62]">TieTheKnot</p>
          <Heading level={1} className="text-4xl font-semibold leading-tight text-[#23292E] sm:text-5xl">
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
        <div className="relative rounded-3xl bg-white p-8 shadow-[0_18px_60px_-24px_rgba(35,41,46,0.15)] ring-1 ring-[#DFB3AE]/30">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#DFB3AE]/30 blur-3xl" aria-hidden />
          <div className="absolute -left-6 -bottom-8 h-24 w-24 rounded-full bg-[#E4BC62]/20 blur-3xl" aria-hidden />
          <div className="space-y-4">
            <Heading level={3} className="text-2xl font-semibold text-[#23292E]">
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
            <p className="text-sm uppercase text-[#E4BC62]">Find vendors for every vibe</p>
            <Heading level={2} className="text-3xl font-semibold text-[#23292E]">
              Whatever your style, we have the team.
            </Heading>
            <Text className="mt-1 text-zinc-600">
              From seaside sunsets to city soirées, explore categories that match your day.
            </Text>
          </div>
          <TextLink href="/collections/all" className="text-sm font-semibold text-[#DFB3AE]">
            Browse all categories
          </TextLink>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group relative overflow-hidden rounded-2xl border border-[#DFB3AE]/30 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-[#E4BC62]/10 blur-2xl" aria-hidden />
              <Text className="text-xs uppercase text-[#DFB3AE]">{cat.subcategories.length} options</Text>
              <Heading level={3} className="mt-1 text-xl font-semibold text-[#23292E]">
                {cat.name}
              </Heading>
              <Text className="mt-1 text-sm text-zinc-600">{cat.description}</Text>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                {cat.subcategories.slice(0, 4).map((s) => (
                  <span key={s.id} className="rounded-full bg-[#E4BC62]/10 px-2.5 py-1 capitalize text-[#E4BC62]">
                    {s.name}
                  </span>
                ))}
              </div>
              <TextLink href={`/collections/${cat.slug}`} className="mt-4 inline-block text-sm font-semibold text-[#E4BC62]">
                View vendors
              </TextLink>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Build your vendor team */}
      <section className="container py-12 sm:py-16">
        <div className="rounded-3xl bg-[#23292E] px-8 py-12 text-white shadow-[0_18px_60px_-24px_rgba(35,41,46,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase text-[#DFB3AE]">Build your vendor team</p>
              <Heading level={2} className="text-3xl font-semibold text-white">
                From shortlists to booked—one guided path.
              </Heading>
              <Text className="mt-2 text-[#DDDED9]">
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
              <div key={item.title} className="rounded-2xl border border-[#DFB3AE]/20 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm uppercase text-[#E4BC62]">{item.title}</p>
                <Text className="mt-2 text-sm text-[#DDDED9]">{item.desc}</Text>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: We'll walk through every part of planning */}
      <section className="container py-12 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase text-[#E4BC62]">We'll walk through every part of planning</p>
            <Heading level={2} className="text-3xl font-semibold text-[#23292E]">
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
                'rounded-2xl border border-[#DFB3AE]/30 bg-white p-5 shadow-sm',
                idx === 0 && 'bg-gradient-to-br from-[#DFB3AE]/10 to-white',
                idx === 1 && 'bg-gradient-to-br from-[#DDDED9]/15 to-white',
                idx === 2 && 'bg-gradient-to-br from-[#E4BC62]/10 to-white'
              )}
            >
              <p className="text-sm uppercase text-[#E4BC62]">{item.title}</p>
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
    'inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#E4BC62]/30'
  const styles =
    variant === 'primary'
      ? 'bg-[#E4BC62] text-[#23292E] hover:bg-[#E4BC62]/90'
      : variant === 'light'
        ? 'border border-white/30 bg-white/10 text-white hover:bg-white/20'
        : 'border border-[#DFB3AE]/30 bg-white text-[#23292E] hover:bg-[#DDDED9]/20'
  return (
    <Link href={href} className={clsx(base, styles)}>
      {children}
    </Link>
  )
}

