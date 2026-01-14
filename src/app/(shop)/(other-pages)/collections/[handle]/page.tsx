import Breadcrumb from '@/components/breadcrumb'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import VendorCard from '@/components/vendor-card'
import { Text, TextLink } from '@/components/text'
import { getVendorCategories, getVendorsByCategory } from '@/data-wedding'
import clsx from 'clsx'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Server-side API call for vendor profiles
async function fetchVendorProfiles() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
  const url = `${API_BASE_URL}/vendor-profiles`
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes (300 seconds)
    })
    
    if (!response.ok) {
      console.error('Failed to fetch vendor profiles:', response.statusText)
      return []
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching vendor profiles:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  if (handle === 'all') {
    return { title: 'All categories', description: 'Browse all wedding vendor categories.' }
  }
  const category = getVendorCategories().find((c) => c.slug === handle)
  if (!category) {
    return {
      title: 'Category not found',
      description: 'The category you are looking for does not exist.',
    }
  }
  const { name, description } = category
  return { title: name, description }
}

export default async function Collection({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { handle } = await params
  const query = await searchParams
  const subcategorySlug = typeof query.subcategory === 'string' ? query.subcategory : undefined
  const priceFilter = typeof query.price === 'string' ? query.price : undefined
  const ratingFilter = typeof query.rating === 'string' ? Number(query.rating) : undefined
  const categories = getVendorCategories()
  if (handle === 'all') {
    return (
      <div className="container">
        <Breadcrumb breadcrumbs={[{ id: 1, name: 'Home', href: '/' }]} currentPage="Categories" className="py-3.5" />
        <Divider />
        <div className="py-12">
          <Heading bigger level={1} className="text-center">
            Explore vendors
          </Heading>
          <Text className="mt-3 text-center text-zinc-600">Choose a category to start planning.</Text>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat.id} className="rounded-lg border border-primary/30 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <Text className="text-xs uppercase text-primary">{cat.subcategories.length} subcategories</Text>
                <Heading level={3} className="text-xl font-semibold text-text">
                  {cat.name}
                </Heading>
                <Text className="mt-2 text-sm text-zinc-600">{cat.description}</Text>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                  {cat.subcategories.map((s) => (
                    <span key={s.id} className="rounded-full bg-blush/50 px-2 py-1 capitalize text-text">
                      {s.name}
                    </span>
                  ))}
                </div>
                <TextLink href={`/collections/${cat.slug}`} className="mt-4 inline-block text-sm font-semibold text-accent">
                  View vendors
                </TextLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  const category = categories.find((c) => c.slug === handle)
  if (!category) {
    return notFound()
  }
  const selectedSubcategory = category.subcategories.find((s) => s.slug === subcategorySlug)
  
  // Get mock vendors for structure (keeping original slugs)
  let vendors = getVendorsByCategory(category.slug, selectedSubcategory?.slug)
  
  // Fetch vendor profiles from backend API and merge with mock data
  const vendorProfiles = await fetchVendorProfiles()
  // Filter by category name (case-insensitive) and only active profiles
  const backendProfiles = vendorProfiles.filter(
    (profile: any) => 
      profile.isActive && 
      profile.category.toLowerCase() === category.name.toLowerCase()
  )
  
  // Helper function to generate slug from business name and category
  const generateSlug = (businessName: string, category: string, id: number) => {
    // Convert to lowercase and replace spaces/special chars with hyphens
    const nameSlug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const categorySlug = category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return `${categorySlug}-${nameSlug}-${id}`
  }

  // Convert backend vendor profiles to TVendor format and add to vendors list
  const backendVendors = backendProfiles.map((profile: any) => ({
    id: String(profile.id),
    handle: generateSlug(profile.businessName, profile.category, profile.id), // Generate slug similar to old format
    name: profile.businessName,
    description: profile.description || '',
    category: profile.category,
    subcategory: profile.category, // Use category as subcategory for now
    location: profile.serviceArea || 'Not specified',
    priceRange: profile.priceRange || '$$', // Use backend price range or default to $$
    rating: undefined, // No ratings yet in MVP
    heroImage: {
      src: profile.imageUrls && profile.imageUrls.length > 0 ? profile.imageUrls[0] : '/placeholder-vendor.jpg',
      alt: `${profile.businessName} - ${profile.category}`,
    },
  }))
  
  // Combine mock vendors with backend vendors (backend vendors first)
  vendors = [...backendVendors, ...vendors]
  
  // Apply filters
  if (priceFilter) {
    vendors = vendors.filter((v) => v.priceRange === priceFilter)
  }
  if (ratingFilter) {
    vendors = vendors.filter((v) => (v.rating ?? 0) >= ratingFilter)
  }
  const breadcrumbs = [{ id: 1, name: 'Home', href: '/' }]

  const priceOptions: string[] = ['$', '$$', '$$$', '$$$$']
  const ratingOptions: number[] = [4.0, 4.5, 4.8]

  const buildHref = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    if (subcategorySlug) params.set('subcategory', subcategorySlug)
    if (priceFilter) params.set('price', priceFilter)
    if (ratingFilter) params.set('rating', String(ratingFilter))
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    const qs = params.toString()
    return qs ? `/collections/${category.slug}?${qs}` : `/collections/${category.slug}`
  }

  const clearHref = `/collections/${category.slug}`
  const hasFilters = Boolean(subcategorySlug || priceFilter || ratingFilter)

  return (
    <div className="container">
      <div>
        <Breadcrumb breadcrumbs={breadcrumbs} currentPage={category.name} className="py-3.5" />

        <Divider />

        <main className="">
          <div className="flex flex-col items-center py-14 text-center lg:py-20">
            <Heading bigger level={1} className="mt-5">
              <span data-slot="dim">Vendors in</span>
              <br />
              <span data-slot="italic" className="underline">
                {category.name}
              </span>
            </Heading>
            <Text className="mt-3 max-w-xl">{category.description}</Text>
            {selectedSubcategory && (
              <div className="mt-4 rounded-full bg-champagne/50 px-3 py-1 text-sm font-semibold text-accent">
                Showing {selectedSubcategory.name}
              </div>
            )}
          </div>

          <div className="mx-auto mt-2 w-full max-w-5xl space-y-3 rounded-2xl border border-primary/30 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Text className="text-sm font-semibold text-text">Filters</Text>
              {hasFilters && (
                <Link
                  href={clearHref}
                  className="text-sm font-semibold text-accent hover:text-accent/80"
                  prefetch={false}
                >
                  Clear all
                </Link>
              )}
            </div>

            <div className="space-y-2">
              <Text className="text-xs uppercase tracking-wide text-zinc-500">Subcategories</Text>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((sub) => {
                  const active = sub.slug === subcategorySlug
                  return (
                    <Link
                      prefetch={false}
                      key={sub.id}
                      href={buildHref({ subcategory: active ? undefined : sub.slug })}
                      className={clsx(
                        'rounded-full border px-3 py-1 text-sm font-semibold transition',
                        active
                          ? 'border-accent/60 bg-champagne/50 text-accent shadow-sm'
                          : 'border-primary/40 bg-white text-zinc-700 hover:border-primary/60 hover:text-primary'
                      )}
                    >
                      {sub.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Text className="text-xs uppercase tracking-wide text-zinc-500">Price</Text>
                <div className="flex flex-wrap gap-2">
                  {priceOptions.map((price) => {
                    const active = price === priceFilter
                    return (
                      <Link
                        prefetch={false}
                        key={price}
                        href={buildHref({ price: active ? undefined : price })}
                        className={clsx(
                          'rounded-full border px-3 py-1 text-sm font-semibold transition',
                          active
                            ? 'border-accent/60 bg-champagne/50 text-accent shadow-sm'
                            : 'border-primary/40 bg-white text-zinc-700 hover:border-primary/60 hover:text-primary'
                        )}
                      >
                        {price}
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Text className="text-xs uppercase tracking-wide text-zinc-500">Rating</Text>
                <div className="flex flex-wrap gap-2">
                  {ratingOptions.map((rating) => {
                    const active = rating === ratingFilter
                    return (
                      <Link
                        prefetch={false}
                        key={rating}
                        href={buildHref({ rating: active ? undefined : String(rating) })}
                        className={clsx(
                          'rounded-full border px-3 py-1 text-sm font-semibold transition',
                          active
                            ? 'border-accent/60 bg-champagne/50 text-accent shadow-sm'
                            : 'border-primary/40 bg-white text-zinc-700 hover:border-primary/60 hover:text-primary'
                        )}
                      >
                        {rating.toFixed(1)}+
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <Divider className="mt-5" />

          <div className="pt-10 pb-16 sm:pt-12 sm:pb-24">
            <section>
              {vendors.length === 0 ? (
                <div className="rounded-lg border border-primary/40 bg-white p-6 text-center text-zinc-600">
                  No vendors found{selectedSubcategory ? ` for ${selectedSubcategory.name}` : ''}.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-7 xl:grid-cols-4">
                  {vendors.map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <Divider />
    </div>
  )
}
