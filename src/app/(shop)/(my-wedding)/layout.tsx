'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// This layout is disabled for MVP - wedding planning features are hidden
export default function MyWeddingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page - wedding planning is disabled in MVP
    router.push('/')
  }, [router])

  return null
}
