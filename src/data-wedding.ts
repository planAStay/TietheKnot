import { TCategory, TVendor, TImage } from './type'

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

type CategoryDefinition = {
  name: string
  description: string
  subcategories: string[]
}

const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    name: 'Photography & Videography',
    description: 'Capture every moment with storytellers, editors, and booth pros.',
    subcategories: [
      'Photographers showcase',
      'Cinematographers',
      'Drone operator showcase',
      'Pre-shoot photographers',
      'Photo booth providers',
      'Editing & retouching services',
      'Other photography & videography services',
      'Marquee rentals',
    ],
  },
  {
    name: 'Venues',
    description: 'Spaces of every style, from ballrooms to intimate retreats.',
    subcategories: [
      'Wedding halls & banquet halls',
      'Hotels',
      'Outdoor gardens',
      'Beach venues',
      'Destination wedding venues',
      'Boutique venues',
      'Mini-function venues (intimate)',
    ],
  },
  {
    name: 'Bridal & Groom Styling',
    description: 'Beauty partners for makeup, hair, grooming, and prep.',
    subcategories: [
      'Bridal makeup artists',
      'Draping & dressing services',
      'Mehendi / henna artists',
      'Hair stylists',
      'Groom stylists',
      'Beauticians & salons',
      'Skin care clinics',
      'Nail technicians',
    ],
  },
  {
    name: 'Fashion & Attire',
    description: 'Looks and fits for the couple and the wedding party.',
    subcategories: [
      'Bridal designers & bridal wear rentals',
      'Groom outfit designers & rentals',
      'Saree shops / dress boutiques',
      'Suit & tuxedo rentals',
      'Traditional wear rentals (Kandyan, Indian bridal)',
      'Bridesmaid dresses',
      'Groomsmen attire',
      "Kids' formalwear",
      'Robes',
      'Fabrics & silks',
      'Footwear',
    ],
  },
  {
    name: 'Décor & Flowers',
    description: 'Floral, ambience, and décor essentials for ceremonies and receptions.',
    subcategories: [
      'Bridal bouquets & boutonniere',
      'Floral designers',
      'Event stylists',
      'Mandap decorators',
      'Stage decorators',
      'Table setup designers',
      'Lighting & ambience designers',
      'Backdrop creators',
      'Wedding decorators',
      'Balloon décor',
      'Event furniture rentals (chairs, tables, couches)',
      'Linen & draping suppliers',
      'Tableware rentals',
    ],
  },
  {
    name: 'Entertainment',
    description: 'Music, performances, and wow-moments for guests.',
    subcategories: [
      'Bands',
      'DJs',
      'Acoustic groups',
      'Traditional drummers',
      'Dancing troops',
      'Live instrumentalists',
      'Entertainers / MCs',
      'Sound technicians',
      'Live artists (caricature, live painting)',
      'Fireworks providers',
      'Cultural entertainers',
    ],
  },
  {
    name: 'Food & Beverages',
    description: 'Catering, desserts, and drinks tailored to your celebration.',
    subcategories: [
      'Catering services',
      'Wedding cakes & sweets',
      'Dessert tables',
      'Sweet suppliers',
      'Cocktail & mocktail bars',
      'Bar services / bartenders',
      'Tea & coffee carts',
      'Ice cream carts',
      'Food trucks & carts',
      'Chocolates & sweets',
    ],
  },
  {
    name: 'Wedding Planning & Coordination',
    description: 'Planners and coordinators to keep every detail on track.',
    subcategories: [
      'Day-of coordinators',
      'Partial or full wedding planners',
      'Event coordinators',
      'Logistics coordinators',
      'Proposals',
    ],
  },
  {
    name: 'Transportation',
    description: 'Arrivals, exits, and guest travel made seamless.',
    subcategories: [
      'Bridal cars',
      'Luxury vehicle rentals',
      'Vintage cars',
      'Party buses',
      'Tuk-tuks for photoshoots',
      'Limo services',
    ],
  },
  {
    name: 'Stationery & Invitations',
    description: 'Printed and digital stationery for every guest touchpoint.',
    subcategories: [
      'Invitation designers & printers',
      'E-invitations / digital invites',
      'Calligraphy',
      'Save-the-date design',
      'Thank-you card designers',
      'Seating chart designers',
      'Laser-cut invitation specialists',
      'Other stationeries',
    ],
  },
  {
    name: 'Wedding Accessories & Extras',
    description: 'Ceremony elements and keepsake-friendly extras.',
    subcategories: [
      'Poruwa suppliers',
      'Oil lamp suppliers',
      'Ring boxes & trays',
      'LED wall providers',
      'Poruwa ceremony experts',
      'Jewellery designers & rentals',
      'Bridal accessories (tiaras, veils, belts, etc.)',
      'Wedding favours suppliers',
    ],
  },
  {
    name: 'Gifts & Souvenirs',
    description: 'Tokens of appreciation and memorable takeaways.',
    subcategories: ['Custom souvenirs', 'Hampers & gift boxes', 'Chocolates & sweets', 'Photo album designers'],
  },
  {
    name: 'Technology Services',
    description: 'Tech that keeps guests connected and experiences smooth.',
    subcategories: [
      'Live streaming providers',
      'Wedding website builders',
      'QR code check-in services',
      'App-based guest management',
      'AR/VR wedding features',
    ],
  },
  {
    name: 'Logistics & Support Services',
    description: 'Operational support to keep the day running flawlessly.',
    subcategories: [
      'Security personnel',
      'Valet parking',
      'Cleaning crews',
      'Power generators',
      'Portable restroom providers (outdoor events)',
      'Stage & rigging technicians',
    ],
  },
  {
    name: 'Religious / Cultural Services',
    description: 'Ceremony leaders and cultural specialists.',
    subcategories: ['Priests / registrars', 'Traditional rituals specialists', 'Jayamangala gatha singers'],
  },
  {
    name: 'Post-Wedding Services',
    description: 'Support after the celebration ends.',
    subcategories: ['Honeymoon planners', 'Travel agencies', 'Home décor consultants', 'Photo album designers'],
  },
  {
    name: 'Future Events (For Phase 2 Expansion)',
    description: 'Reusable event categories for future phases.',
    subcategories: [
      'Birthday parties',
      'Corporate events',
      'Baby showers',
      'Anniversaries',
      'Graduations',
      'Engagements',
      'Private parties',
      'Community events',
      'Religious events',
    ],
  },
]

const categories: TCategory[] = CATEGORY_DEFINITIONS.map((category) => ({
  id: slugify(category.name),
  name: category.name,
  slug: slugify(category.name),
  description: category.description,
  subcategories: category.subcategories.map((name) => ({
    id: slugify(name),
    name,
    slug: slugify(name),
  })),
}))

const priceRanges: TVendor['priceRange'][] = ['$', '$$', '$$$']
const VENDORS_PER_SUBCATEGORY = 4

// Map categories to their image directories
const categoryImageMap: Record<string, string> = {
  'photography-and-videography': 'photography',
  'venues': 'venues',
  'bridal-and-groom-styling': 'bridal',
  'fashion-and-attire': 'bridal',
  'decor-and-flowers': 'decor',
  'entertainment': 'entertainment',
  'food-and-beverages': 'catering',
  'wedding-planning-and-coordination': 'planning',
  'transportation': 'transportation',
  'stationery-and-invitations': 'planning',
  'wedding-accessories-and-extras': 'decor',
  'gifts-and-souvenirs': 'catering',
  'technology-services': 'photography',
  'logistics-and-support-services': 'planning',
  'religious-cultural-services': 'venues',
  'post-wedding-services': 'planning',
  'future-events-for-phase-2-expansion': 'entertainment',
}

// Get appropriate image for a vendor
const getVendorImage = (categorySlug: string, imageIndex: number): string => {
  const imageFolder = categoryImageMap[categorySlug] || 'venues'
  const imageNumber = (imageIndex % 8) + 1
  
  // Determine image name based on folder
  const imageName = imageFolder === 'photography' ? `photo-${imageNumber}.jpg` :
                    imageFolder === 'venues' ? `venue-${imageNumber}.jpg` :
                    imageFolder === 'bridal' ? `bridal-${imageNumber}.jpg` :
                    imageFolder === 'decor' ? `decor-${imageNumber}.jpg` :
                    imageFolder === 'entertainment' ? `entertainment-${imageNumber}.jpg` :
                    imageFolder === 'catering' ? `catering-${imageNumber}.jpg` :
                    imageFolder === 'planning' ? `planning-${(imageIndex % 4) + 1}.jpg` :
                    imageFolder === 'transportation' ? `transport-${(imageIndex % 4) + 1}.jpg` :
                    `venue-${imageNumber}.jpg`
  
  return `/images/wedding/${imageFolder}/${imageName}`
}

const buildVendor = (
  category: TCategory,
  subcategory: TCategory['subcategories'][number],
  variantIndex: number
): TVendor => {
  const handleBase = `${category.slug}-${subcategory.slug}`
  const rating = Number((4.2 + (variantIndex % 5) * 0.15).toFixed(1))

  // Generate gallery images (4 additional images for the gallery)
  const galleryImages: TImage[] = []
  for (let i = 1; i <= 4; i++) {
    const imageIndex = (variantIndex + i) % 8
    galleryImages.push({
      src: getVendorImage(category.slug, imageIndex),
      alt: `${subcategory.name} gallery image ${i}`,
    })
  }

  return {
    id: `${handleBase}-${variantIndex + 1}`,
    name: `${subcategory.name} ${variantIndex % 2 === 0 ? 'Collective' : 'Studio'} ${variantIndex + 1}`,
    handle: `${handleBase}-${variantIndex + 1}`,
    category: category.id,
    subcategory: subcategory.id,
    location: 'Colombo, Sri Lanka',
    priceRange: priceRanges[variantIndex % priceRanges.length],
    rating: Math.min(rating, 4.9),
    tags: [category.name, subcategory.name],
    heroImage: {
      src: getVendorImage(category.slug, variantIndex),
      alt: `${subcategory.name} showcase`,
    },
    images: galleryImages,
    description: `${subcategory.name} offered by our ${category.name.toLowerCase()} partners.`,
    packages: [
      {
        name: 'Standard',
        priceFrom: 150 + variantIndex * 25,
        description: 'Popular package tailored for most events.',
      },
    ],
    // Add PDF to some vendors for testing (every 3rd vendor gets PDF, creating mix of packages only, PDF only, and both)
    pricingPdf: variantIndex % 3 === 0 ? '/pricing-pdfs/sample-pricing.pdf' : undefined,
    contact: {
      phone: '+94 77 000 0000',
      email: `${handleBase}@vendors.tietheknot.test`,
    },
    featured: variantIndex % 4 === 0,
  }
}

const vendors: TVendor[] = categories.flatMap((category) =>
  category.subcategories.flatMap((subcategory) =>
    Array.from({ length: VENDORS_PER_SUBCATEGORY }, (_, idx) => buildVendor(category, subcategory, idx))
  )
)

export function getVendorCategories(): TCategory[] {
  return categories
}

export function getAllVendors(): TVendor[] {
  return vendors
}

export function getVendorsByCategory(categorySlug: string, subcategorySlug?: string): TVendor[] {
  return vendors.filter(
    (vendor) =>
      vendor.category === categorySlug && (subcategorySlug ? vendor.subcategory === subcategorySlug : true)
  )
}

export function getVendorByHandle(handle: string): TVendor | undefined {
  return vendors.find((vendor) => vendor.handle === handle)
}

