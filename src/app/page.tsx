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
    <div className="bg-gradient-to-b from-background via-primary/40 to-background text-text">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden md:h-[700px] lg:h-[800px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/wedding/hero-wedding-1.jpg"
            alt="Beautiful wedding celebration"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>

        {/* Content */}
        <div className="container relative flex h-full items-center justify-center">
          <div className="max-w-5xl text-center">
            {/* Top tagline */}
            <p className="mb-6 text-lg font-medium uppercase tracking-widest text-white/90 sm:text-xl md:text-2xl">
              Wedding day is your DREAM DAY
            </p>

            {/* Main Title */}
            <Heading level={1} className="mb-6 text-5xl font-bold leading-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
              TIE THE KNOT
            </Heading>

            {/* Subtitle with gradient */}
            <div className="mb-8 space-y-2">
              <p className="text-2xl font-light italic text-white sm:text-3xl md:text-4xl">
                Your Vision. Your Style. Your Day.
              </p>
              <p className="text-xl font-light text-white/90 sm:text-2xl md:text-3xl">
                We make it Happen.
              </p>
            </div>

            {/* Decorative line */}
            <div className="mx-auto mb-8 h-px w-64 bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 sm:gap-8">
              {[
                { icon: '✓', label: 'Verified Vendors' },
                { icon: '★', label: 'Top Rated' },
                { icon: '♥', label: 'Trusted by 1000+' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-xl text-champagne sm:text-2xl">{item.icon}</span>
                  <span className="text-sm font-medium sm:text-base">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
          </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-rose-50 py-8 shadow-sm shadow-accent/10">
        <div className="container">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: '500+', label: 'Trusted Vendors' },
              { value: '1,200+', label: 'Happy Couples' },
              { value: '15+', label: 'Categories' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-secondary sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-text/70 sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
          </div>
      </section>

      {/* Welcome / Introduction Section */}
      <section className="container py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Welcome to TieTheKnot</p>
          <Heading level={2} className="mt-3 text-4xl font-bold text-text sm:text-5xl">
            Creating Unforgettable Moments
          </Heading>
          <Text className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text/75">
            We believe every wedding should be as unique as your love story. With access to Sri Lanka\'s finest wedding professionals and comprehensive planning tools, we transform the journey from "Yes!" to "I do" into an experience filled with joy, not stress.
          </Text>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="bg-gradient-to-b from-rose-50 to-background py-16 sm:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Services</p>
            <Heading level={2} className="mt-3 text-4xl font-bold text-text sm:text-5xl">
              Everything You Need for Your Big Day
                  </Heading>
            <Text className="mx-auto mt-4 max-w-2xl text-lg text-text/75">
              From the first consultation to the last dance, we\'re with you every step of the way
            </Text>
                </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: 'Complete Vendor Network',
                desc: 'Browse Sri Lanka\'s trusted photographers, florists, planners, and more in one place.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                title: 'Perfect Venue Matching',
                desc: 'Match with beachfront, garden, or ballroom venues that fit your vibe and guest list.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Seamless Coordination',
                desc: 'Keep every vendor request and conversation organized so everyone stays on the same page.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                title: 'Stunning Design & Décor',
                desc: 'Partner with designers for florals, lighting, and styling that mirror your theme.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: 'Expert Planning Support',
                desc: 'Use checklists, timelines, budgets, and inspiration boards without switching tools.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Flawless Day-of Coordination',
                desc: 'Day-of coordinators run the schedule and vendors so you can enjoy every moment.',
              },
            ].map((service, idx) => (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-2xl border border-accent/30 bg-surface/90 p-6 shadow-sm shadow-accent/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-md sm:p-7"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/30 blur-2xl transition-all duration-500 group-hover:scale-150" />
                <div className="relative space-y-3">
                  <div className="inline-flex rounded-xl bg-primary/40 p-4 text-secondary transition-transform duration-300 group-hover:scale-110">
                    {service.icon}
                  </div>
                  <Heading
                    level={3}
                    fontSize="text-lg sm:text-xl font-semibold leading-tight"
                    className="text-text"
                  >
                    {service.title}
                  </Heading>
                  <p
                    className="text-xs leading-6 text-text/75 sm:text-sm"
                    style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {service.desc}
                  </p>
                </div>
              </div>
                ))}
              </div>
        </div>
      </section>

      {/* Why Choose TieTheKnot Section */}
      <section className="container py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-champagne/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/images/wedding/venues/venue-1.jpg"
                alt="Beautiful wedding venue"
                width={700}
                height={700}
                className="h-[600px] w-full object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 space-y-6 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Why Choose Us</p>
            <Heading level={2} className="text-4xl font-bold text-text sm:text-5xl">
              Why TieTheKnot?
            </Heading>
            <Text className="text-lg leading-relaxed text-text/80">
              Planning your wedding should be exciting, not overwhelming. We\'ve built the ultimate platform to make your journey seamless.
            </Text>

            <div className="space-y-4">
              {[
                {
                  icon: '✓',
                  title: 'Verified & Trusted Vendors',
                  desc: 'Every vendor on our platform is carefully vetted for quality, reliability, and professionalism.',
                },
                {
                  icon: '★',
                  title: 'Personalized Recommendations',
                  desc: 'Get matched with vendors that fit your style, budget, and vision perfectly.',
                },
                {
                  icon: '♥',
                  title: 'Stress-Free Planning',
                  desc: 'Our intuitive tools keep everything organized, from favorites to quotes to timelines.',
                },
                {
                  icon: '⚡',
                  title: 'Exclusive Vendor Deals',
                  desc: 'Access special packages and discounts available only through TieTheKnot.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blush text-2xl text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <p className="mb-1 text-lg font-semibold text-text">{item.title}</p>
                    <Text className="text-sm leading-relaxed text-text/80">{item.desc}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Find vendors for every vibe */}
      <section className="bg-gradient-to-b from-rose-50 to-background py-16 sm:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Vendor Categories</p>
            <Heading level={2} className="mt-3 text-4xl font-bold text-text sm:text-5xl">
              Find Vendors for Every Aspect
            </Heading>
            <Text className="mx-auto mt-4 max-w-2xl text-lg text-text/75">
              Whatever your style, we have the team. From intimate gatherings to grand celebrations, discover vendors for every need.
            </Text>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-accent/30 bg-surface/90 p-6 shadow-sm shadow-accent/10 transition-all duration-500 hover:-translate-y-2 hover:border-accent/60 hover:shadow-md sm:p-7"
              >
                {/* Decorative background */}
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-primary/25 via-accent/25 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Category icon */}
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-rose-50 shadow-sm ring-1 ring-accent/30 transition-all duration-500 group-hover:scale-110 group-hover:shadow-md sm:mb-4">
                  <svg className="h-6 w-6 text-secondary transition-transform duration-500 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                </div>

                {/* Title */}
                <Heading
                  level={3}
                  fontSize="text-xl font-semibold leading-tight sm:text-2xl"
                  className="mb-2 text-text transition-colors duration-300 group-hover:text-primary"
                >
                  {cat.name}
                </Heading>

                {/* Description */}
                <p
                  className="mb-4 text-xs leading-6 text-text/75 sm:text-sm"
                  style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {cat.description}
                </p>

                {/* Badge */}
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/50 px-3 py-1.5 ring-1 ring-accent/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  <Text className="text-xs font-semibold uppercase tracking-wider text-text">
                    {cat.subcategories.length} services
                  </Text>
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-300 group-hover:gap-3">
                  <span>Explore</span>
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section - Your Vision, Style, Passion, Day */}
      <section className="bg-gradient-to-b from-rose-50 to-background py-16 sm:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Wedding Day is Your Dream Day</p>
            <Heading level={2} className="mt-3 text-4xl font-bold text-text sm:text-5xl">
              We Make It Happen.
            </Heading>
            <div className="mx-auto mt-6 flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-1 w-8 rounded-full bg-primary" />
              ))}
            </div>
            <Text className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text/80">
              Your Vision. Your Style. Your Passion. Your Day. We make it Happen.
            </Text>
            <Text className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-text/75">
              Often people think that hiring a wedding/event planner is going to be a huge expense, but most of the time we can actually save you money. As well as passing on our supplier discounts directly to you, we will work with you to manage your wedding budget. You tell us what you want to spend and we will make sure you stick to this, we will work with you to get you the best value for money on every last detail. We are your best wedding planner in Sri Lanka.
            </Text>
          </div>

          {/* Image Grid */}
          <div className="mt-12 grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                image: '/images/wedding/bridal/bridal-1.jpg',
                title: 'Your Vision',
                description: 'Bringing your dream wedding to life',
              },
              {
                image: '/images/wedding/venues/venue-2.jpg',
                title: 'Your Style',
                description: 'Personalized to perfection',
              },
              {
                image: '/images/wedding/bridal/bridal-5.jpg',
                title: 'Your Passion',
                description: 'Every detail with love',
              },
              {
                image: '/images/wedding/bridal/bridal-6.jpg',
                title: 'Your Day',
                description: 'Unforgettable moments',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative aspect-[3/4] overflow-hidden"
              >
                {/* Image */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-90" />
                
                {/* Text Content */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="text-center text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="text-3xl font-bold tracking-wide sm:text-4xl">{item.title}</h3>
                    <p className="mt-3 text-base sm:text-lg">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
          ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-background to-rose-100 py-16 sm:py-20">
          {/* Decorative elements */}
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Simple Process</p>
            <Heading level={2} className="mt-3 text-4xl font-bold text-text sm:text-5xl">
              From YES to "I DO"
              </Heading>
            <Text className="mx-auto mt-4 max-w-2xl text-lg text-text/80">
              Our streamlined platform makes wedding planning effortless. Here\'s how it works:
              </Text>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: 'Explore & Discover',
                desc: 'Discover carefully curated wedding professionals across all categories. Find the perfect partners who align with your vision and style.',
              },
              {
                step: '02',
                  icon: (
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ),
                title: 'Plan & Organize',
                desc: 'Save your favorites and manage everything in one place. Compare options, track your budget, and stay organized throughout your journey.',
                },
                {
                step: '03',
                  icon: (
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                title: 'Create Your Day',
                desc: 'Connect with your chosen professionals and bring your vision to life. We support you from your first consultation to your last dance.',
              },
            ].map((item, idx) => (
              <div key={item.step} className="group relative">
                {/* Connecting line */}
                {idx < 2 && (
                  <div className="absolute left-full top-12 hidden h-0.5 w-full bg-gradient-to-r from-accent/25 to-transparent md:block" />
                )}
                
                <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-white/80 p-6 backdrop-blur transition-all duration-300 hover:bg-surface/90 sm:p-7">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/30 blur-2xl transition-all duration-500 group-hover:scale-150" />
                  
                  <div className="relative">
                    {/* Step number */}
                    <div className="mb-3 text-4xl font-bold text-secondary/30 sm:mb-4 sm:text-5xl">{item.step}</div>
                    
                    {/* Icon */}
                    <div className="mb-3 inline-flex rounded-xl bg-primary/40 p-2.5 text-secondary sm:mb-4">
                      {item.icon}
                    </div>
                    
                    <Heading
                      level={3}
                      fontSize="text-lg font-semibold leading-tight sm:text-xl"
                      className="mb-2 text-text"
                    >
                      {item.title}
                    </Heading>
                    <p
                      className="text-xs leading-6 text-text/75 sm:text-sm"
                      style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Testimonials</p>
          <Heading level={2} className="mt-3 text-4xl font-bold text-text sm:text-5xl">
            Stories from Happy Couples
          </Heading>
          <Text className="mx-auto mt-4 max-w-2xl text-lg text-text/75">
            Real love stories from couples who created their dream weddings with TieTheKnot
          </Text>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote: "TieTheKnot was a game-changer for our wedding planning! We found the most amazing vendors—from our photographer to our caterer. Everything was seamless, and our day was absolutely perfect!",
              author: 'Sarah & Michael Fernando',
              location: 'Colombo',
              date: 'Married June 2024',
              rating: 5,
              image: '/images/wedding/bridal/bridal-1.jpg',
            },
            {
              quote: "The platform made it so easy to compare vendors and request quotes. We saved hours of research and found vendors we absolutely loved. Highly recommend to any couple planning their big day!",
              author: 'Priya & Rajesh Kumar',
              location: 'Kandy',
              date: 'Married August 2024',
              rating: 5,
              image: '/images/wedding/bridal/bridal-2.jpg',
            },
            {
              quote: "From venue selection to the final decorations, TieTheKnot helped us every step of the way. The vendor quality is exceptional, and the planning tools kept us organized throughout.",
              author: 'Emily & James Perera',
              location: 'Galle',
              date: 'Married September 2024',
              rating: 5,
              image: '/images/wedding/bridal/bridal-3.jpg',
            },
          ].map((testimonial, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-3xl border border-accent/30 bg-surface/90 shadow-sm shadow-accent/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-md"
            >
              {/* Top decorative gradient */}
              <div className="h-2 w-full bg-gradient-to-r from-primary via-champagne to-primary" />
              
              <div className="p-8">
                {/* Quote icon */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/40">
                  <svg className="h-6 w-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote text */}
                <Text className="mb-6 italic leading-relaxed text-text/80">"{testimonial.quote}"</Text>

                {/* Author info */}
                <div className="flex items-center gap-4 border-t border-primary/20 pt-6">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-primary/30">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                  <p className="font-semibold text-text">{testimonial.author}</p>
                    <p className="text-sm text-text/70">{testimonial.location} • {testimonial.date}</p>
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/30 blur-2xl transition-all duration-500 group-hover:scale-150" />
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-primary/20 pt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">4.9/5</div>
          <div className="text-sm text-text/70">Average Rating</div>
          </div>
          <div className="h-12 w-px bg-primary/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">1,200+</div>
          <div className="text-sm text-text/70">Happy Couples</div>
          </div>
          <div className="h-12 w-px bg-primary/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">500+</div>
          <div className="text-sm text-text/70">Verified Vendors</div>
          </div>
        </div>
      </section>

      {/* Section: We'll walk through every part of planning */}
      <section className="bg-gradient-to-b from-rose-50 to-background py-16 sm:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Planning Tools</p>
            <Heading level={2} className="mt-3 text-4xl font-bold text-text sm:text-5xl">
              Everything You Need in One Place
          </Heading>
            <Text className="mx-auto mt-4 max-w-2xl text-lg text-text/75">
              Our comprehensive toolkit keeps you organized and on track from engagement to "I do"
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
                title: 'Wedding Countdown',
                desc: 'Your wedding date stays visible with a beautiful countdown timer. Never lose sight of your big day.',
              gradient: 'from-primary/50 via-rose-100 to-white',
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              ),
                title: 'Favorites Collection',
                desc: 'Save vendors you love with a simple heart tap. Build your dream team across all categories.',
              gradient: 'from-rose-50 to-primary/40',
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
                title: 'Quote Management',
                desc: 'Request and track quotes from multiple vendors. Compare packages and prices side by side.',
              gradient: 'from-rose-50 to-primary/45',
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              ),
                title: 'Smart Filters',
                desc: 'Find exactly what you need with filters for location, budget, style, and availability.',
              gradient: 'from-rose-50 to-white',
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
                title: 'Budget Tracking',
                desc: 'Keep your spending on track. See estimated costs and actual quotes in one dashboard.',
              gradient: 'from-primary/40 to-rose-50',
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ),
                title: 'Mobile Optimized',
                desc: 'Plan on the go with our fully responsive design. Access everything from any device.',
              gradient: 'from-rose-50 to-white',
            },
          ].map((item, idx) => (
            <div
              key={item.title}
              className={clsx(
                  'group relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br p-6 shadow-sm shadow-accent/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-md sm:p-7',
                  item.gradient
                )}
            >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/25 blur-2xl transition-all duration-500 group-hover:scale-150" />
              <div className="relative">
                  <div className="mb-3 inline-flex rounded-xl bg-primary/40 p-3 text-secondary shadow-sm ring-1 ring-accent/30 transition-transform duration-300 group-hover:scale-110 sm:mb-4">
                  {item.icon}
                </div>
                  <Heading
                    level={3}
                    fontSize="text-lg font-semibold leading-tight sm:text-xl"
                    className="mb-2 text-text"
                  >
                    {item.title}
                  </Heading>
                <p
                  className="text-xs leading-6 text-text/75 sm:text-sm"
                  style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <CTAButton href="/my-wedding" variant="primary">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
              Start Your Planning
          </CTAButton>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-background to-rose-50 px-8 py-20 shadow-2xl ring-1 ring-accent/30 sm:px-16 sm:py-24">
          {/* Decorative background elements */}
          <div className="absolute inset-0">
            <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/35 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/60 px-5 py-2.5 shadow-lg ring-1 ring-accent/30 backdrop-blur">
              <svg className="h-5 w-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-text">Start Your Journey Today</span>
            </div>
            
            {/* Main heading */}
            <Heading level={2} className="text-5xl font-bold leading-tight text-text sm:text-6xl lg:text-7xl">
              Let's Create Your<br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Perfect Wedding
              </span>
            </Heading>
            
            {/* Subtext */}
            <Text className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-text/80">
              Join over 1,200 couples who\'ve created unforgettable celebrations with TieTheKnot. Start planning your perfect day with trusted professionals and powerful planning tools—completely free.
            </Text>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <CTAButton href="/collections/all" variant="primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Planning Now
              </CTAButton>
              <CTAButton href="/my-wedding" variant="ghost">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                How It Works
              </CTAButton>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
              {[
                { icon: '✓', text: 'Free to use' },
                { icon: '✓', text: 'Trusted professionals' },
                { icon: '✓', text: 'Complete planning tools' },
                { icon: '✓', text: 'Expert support' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 rounded-full bg-primary/50 px-4 py-2 shadow-sm ring-1 ring-accent/30 backdrop-blur">
                  <span className="text-secondary">{item.icon}</span>
                  <span className="font-medium text-text">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Additional trust elements */}
            <div className="mt-12 border-t border-primary/20 pt-8">
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white">
                        <Image
                          src={`/images/wedding/bridal/bridal-${i}.jpg`}
                          alt="Happy couple"
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                      <span className="text-sm font-bold text-text">4.9/5</span>
                    </div>
                    <p className="text-xs text-text/70">from 500+ reviews</p>
                  </div>
              </div>
                <div className="h-12 w-px bg-primary/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">1,200+</p>
                  <p className="text-xs text-text/70">Successful Weddings</p>
              </div>
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
  variant?: 'primary' | 'ghost' | 'light' | 'outline-light'
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background'
  const styles =
    variant === 'primary'
      ? 'bg-secondary text-text hover:bg-secondary/90 hover:shadow-lg hover:scale-105'
      : variant === 'light'
        ? 'border-2 border-accent/40 bg-primary text-text hover:bg-primary/90 hover:shadow-lg hover:scale-105'
        : variant === 'outline-light'
          ? 'border-2 border-accent/50 bg-transparent text-text hover:bg-primary/70 hover:border-accent/70 backdrop-blur'
          : 'border-2 border-accent/40 bg-transparent text-text hover:bg-primary/70 hover:text-text hover:border-accent/60 hover:shadow-md hover:scale-105'
  return (
    <Link href={href} className={clsx(base, styles)}>
      {children}
    </Link>
  )
}
