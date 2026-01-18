'use client'

import { useState, useEffect, useRef } from 'react'
import { VENDOR_CATEGORIES } from '@/lib/constants/vendor-categories'

interface CategoryCarouselProps {
  activeCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export default function CategoryCarousel({ activeCategory, onCategoryChange }: CategoryCarouselProps) {
  const [currentGroup, setCurrentGroup] = useState(0)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isTabletView, setIsTabletView] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLDivElement>(null)
  
  // Group categories for desktop carousel (4-5 per group)
  const categoryGroups = [
    ['All Categories', ...VENDOR_CATEGORIES.slice(0, 4)],
    [...VENDOR_CATEGORIES.slice(4, 9)],
    [...VENDOR_CATEGORIES.slice(9, 14)],
    [...VENDOR_CATEGORIES.slice(14)],
  ]
  
  // Detect device type
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640)
      setIsTabletView(window.innerWidth >= 640 && window.innerWidth < 1024)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Find which group the active category is in
  const getCategoryGroup = (category: string | null) => {
    if (!category || category === 'All Categories') return 0
    for (let i = 0; i < categoryGroups.length; i++) {
      if (categoryGroups[i].includes(category)) {
        return i
      }
    }
    return 0
  }
  
  // Update current group when active category changes
  useEffect(() => {
    const group = getCategoryGroup(activeCategory)
    setCurrentGroup(group)
  }, [activeCategory])
  
  // Scroll active tab into view on mobile/tablet
  useEffect(() => {
    if ((isMobileView || isTabletView) && activeTabRef.current && scrollContainerRef.current) {
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
  }, [activeCategory, isMobileView, isTabletView])
  
  const handleClickCategory = (category: string) => {
    const selectedCategory = category === 'All Categories' ? null : category
    onCategoryChange(selectedCategory)
  }
  
  const handlePrevGroup = () => {
    if (currentGroup > 0 && !isAnimating) {
      setIsAnimating(true)
      setCurrentGroup(currentGroup - 1)
      setTimeout(() => setIsAnimating(false), 250)
    }
  }
  
  const handleNextGroup = () => {
    if (currentGroup < categoryGroups.length - 1 && !isAnimating) {
      setIsAnimating(true)
      setCurrentGroup(currentGroup + 1)
      setTimeout(() => setIsAnimating(false), 250)
    }
  }
  
  // All categories for mobile/tablet scrollable view
  const allCategories = ['All Categories', ...VENDOR_CATEGORIES]
  const visibleTabs = categoryGroups[currentGroup] || []
  const hasAllCategories = visibleTabs.includes('All Categories')
  
  // Mobile/Tablet: scrollable horizontal list
  if (isMobileView || isTabletView) {
    return (
      <div className="relative mb-6 flex flex-col border-b border-zinc-200 pb-4">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto py-2 snap-x scroll-smooth gap-2 [&::-webkit-scrollbar]:hidden"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          } as React.CSSProperties & { WebkitOverflowScrolling?: string }}
        >
          <div className="pl-4" />
          {allCategories.map((category, index) => {
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
          <div className="pr-4" />
        </div>
      </div>
    )
  }
  
  // Desktop: carousel with navigation arrows
  return (
    <div className="relative mb-8 flex flex-col border-b border-zinc-200 pb-4">
      <div className="flex items-center justify-center">
        {/* Left arrow */}
        <button
          className={`absolute left-0 p-2 rounded-full transition-all duration-300 ${
            currentGroup === 0 || hasAllCategories
              ? 'opacity-0 pointer-events-none' 
              : 'cursor-pointer hover:bg-zinc-100 hover:scale-110 active:scale-95'
          }`}
          onClick={handlePrevGroup}
          aria-label="Previous categories"
          disabled={isAnimating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Categories container */}
        <div className={`flex justify-center items-center gap-2 transition-opacity duration-250 ${
          isAnimating ? 'opacity-50' : 'opacity-100'
        }`}>
          {visibleTabs.map((category, index) => {
            const isActive = (category === 'All Categories' && activeCategory === null) || 
                           (category === activeCategory)
            return (
              <button
                key={`${currentGroup}-${index}`}
                className={`relative px-4 py-2 font-medium text-sm whitespace-nowrap cursor-pointer transition-all duration-200 rounded-full
                  ${isActive 
                    ? 'bg-text text-background' 
                    : 'text-text/70 hover:text-text hover:bg-zinc-100'}`}
                onClick={() => handleClickCategory(category)}
              >
                {category}
              </button>
            )
          })}
        </div>
        
        {/* Right arrow */}
        <button
          className={`absolute right-0 p-2 rounded-full transition-all duration-300 ${
            currentGroup === categoryGroups.length - 1 
              ? 'opacity-0 pointer-events-none' 
              : 'cursor-pointer hover:bg-zinc-100 hover:scale-110 active:scale-95'
          }`}
          onClick={handleNextGroup}
          aria-label="Next categories"
          disabled={isAnimating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

