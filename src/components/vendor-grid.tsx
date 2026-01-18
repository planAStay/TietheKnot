'use client'

import { useState, useMemo } from 'react'
import VendorCard from './vendor-card'
import CategoryCarousel from './category-carousel'
import { TVendor } from '@/type'

interface VendorGridProps {
  vendors: TVendor[]
}

export default function VendorGrid({ vendors }: VendorGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter vendors by selected category
  const filteredVendors = useMemo(() => {
    if (!selectedCategory) {
      return vendors
    }
    return vendors.filter((vendor) => vendor.category === selectedCategory)
  }, [vendors, selectedCategory])

  // Handle empty state when no vendors exist
  if (vendors.length === 0) {
    return (
      <div className="py-8">
        <div className="text-center py-16">
          <p className="text-lg text-text/70">
            No vendors available at the moment. Please check back later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      {/* Category Carousel */}
      <CategoryCarousel 
        vendors={vendors}
        activeCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Vendor Count */}
      <div className="mb-6 text-sm text-text/70">
        {filteredVendors.length} {filteredVendors.length === 1 ? 'vendor' : 'vendors'} found
      </div>

      {/* Vendors Grid */}
      {filteredVendors.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-text/70">
            No vendors found in this category. Try selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVendors.map((vendor, index) => (
            <VendorCard 
              key={vendor.id} 
              vendor={vendor} 
              priority={index < 4}
            />
          ))}
        </div>
      )}
    </div>
  )
}

