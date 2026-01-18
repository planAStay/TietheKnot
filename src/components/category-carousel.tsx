'use client'

import { useMemo, useEffect, useRef } from 'react'
import { VENDOR_CATEGORIES } from '@/lib/constants/vendor-categories'
import { TVendor } from '@/type'

interface CategoryCarouselProps {
  vendors: TVendor[]
  activeCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export default function CategoryCarousel({ vendors, activeCategory, onCategoryChange }: CategoryCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLDivElement>(null)
  
  // Extract unique categories from vendors (case-insensitive matching)
  const categoriesWithListings = useMemo(() => {
    const uniqueCategories = new Set<string>()
    vendors.forEach(vendor => {
      // Match vendor category to VENDOR_CATEGORIES (case-insensitive)
      const matchedCategory = VENDOR_CATEGORIES.find(
        cat => cat.toLowerCase() === vendor.category.toLowerCase()
      )
      if (matchedCategory) {
        uniqueCategories.add(matchedCategory) // Use the canonical name from VENDOR_CATEGORIES
      }
    })
    return Array.from(uniqueCategories).sort() // Sort alphabetically for consistency
  }, [vendors])
  
  // Combine "All Categories" with filtered categories
  const displayCategories = useMemo(() => {
    if (categoriesWithListings.length === 0) {
      return []
    }
    return ['All Categories', ...categoriesWithListings]
  }, [categoriesWithListings])
  
  // Scroll active tab into view on mobile/tablet
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const activeTab = activeTabRef.current
      
      const containerWidth = container.offsetWidth
      const activeTabWidth = activeTab.offsetWidth
      const activeTabLeft = activeTab.offsetLeft
      
      const scrollPosition = activeTabLeft - (containerWidth / 2) + (activeTabWidth / 2)
      
      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      })
    }
  }, [activeCategory])
  
  const handleClickCategory = (category: string) => {
    const selectedCategory = category === 'All Categories' ? null : category
    onCategoryChange(selectedCategory)
  }
  
  // If no vendors exist, don't render the carousel
  if (vendors.length === 0) {
    return null
  }
  
  // If no categories have listings, don't render the carousel
  if (displayCategories.length === 0) {
    return null
  }
  
  // Single horizontal scrollable carousel for all devices
  return (
    <div className="relative mb-6 flex flex-col border-b border-zinc-200 pb-4">
      <div 
        ref={scrollContainerRef}
        className="flex justify-center overflow-x-auto py-2 snap-x scroll-smooth gap-2 [&::-webkit-scrollbar]:hidden"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        } as React.CSSProperties & { WebkitOverflowScrolling?: string }}
      >
        <div className="pl-4 flex-shrink-0" />
        {displayCategories.map((category, index) => {
          const isActive = (category === 'All Categories' && activeCategory === null) || 
                         (category === activeCategory)
          return (
            <div 
              key={index}
              ref={isActive ? activeTabRef : null}
              className={`relative px-4 py-2 flex-shrink-0 font-medium text-sm whitespace-nowrap cursor-pointer snap-start transition-all duration-200 rounded-full
                ${isActive 
                  ? 'bg-text text-background' 
                  : 'text-text/70 hover:text-text hover:bg-zinc-100'}`}
              onClick={() => handleClickCategory(category)}
            >
              <span>{category}</span>
            </div>
          )
        })}
        <div className="pr-4 flex-shrink-0" />
      </div>
    </div>
  )
}

