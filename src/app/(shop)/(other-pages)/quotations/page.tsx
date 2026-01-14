'use client'

import { Heading } from '@/components/heading'
import { Text, TextLink } from '@/components/text'
import { useAuth } from '@/lib/auth-context'
import { getMyQuoteRequests } from '@/lib/api/quote-request'
import { QuoteRequest, QuoteStatus } from '@/type'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'

const statusColor: Record<QuoteStatus, string> = {
  OPEN: 'text-blue-700 bg-blue-50',
  QUOTED: 'text-yellow-700 bg-yellow-50',
  ACCEPTED: 'text-emerald-700 bg-emerald-50',
  DECLINED: 'text-red-700 bg-red-50',
}

export default function QuotationsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadQuoteRequests()
  }, [authLoading, isAuthenticated, router])

  const loadQuoteRequests = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const quotes = await getMyQuoteRequests()
      setQuoteRequests(quotes)
    } catch (err) {
      console.error('Error loading quote requests:', err)
      setError(err instanceof Error ? err.message : 'Failed to load quote requests.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <Text>Loading quote requests...</Text>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <Heading level={1} className="text-3xl font-semibold text-text">
          Quotations
        </Heading>
        <TextLink href="/collections/all" className="text-sm font-semibold text-accent">
          Find more vendors
        </TextLink>
      </div>
      <Text className="mt-1 text-sm text-zinc-600">
        Track every request you send. Update status as vendors reply.
      </Text>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <Text className="text-sm text-red-700">{error}</Text>
        </div>
      )}

      {quoteRequests.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-primary/40 bg-white p-6 text-center">
          <Text className="text-sm text-zinc-600">No requests yet. Ask for quotes from vendor pages.</Text>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {quoteRequests.map((q) => (
            <Link
              key={q.id}
              href={`/quotes/${q.id}`}
              className="block rounded-lg border border-primary/30 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Text className="text-sm font-semibold text-text">{q.vendorProfileName}</Text>
                  <Text className="text-xs text-zinc-500 capitalize">
                    {q.vendorProfileCategory}
                  </Text>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[q.status]}`}>
                  {q.status}
                </span>
              </div>
              <div className="mt-2 grid gap-3 text-sm text-zinc-600 md:grid-cols-3">
                {q.quote && <p className="font-semibold text-rose-600">Quote: ${q.quote.amount.toLocaleString()}</p>}
                <p>Guests: {q.guestCount}</p>
                <p>Date: {new Date(q.weddingDate).toLocaleDateString()}</p>
              </div>
              {q.location && <p className="mt-2 text-sm text-zinc-600">Location: {q.location}</p>}
              <Text className="mt-1 text-xs text-zinc-400">Sent {new Date(q.createdAt).toLocaleDateString()}</Text>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

