'use client'

import { Logo } from '@/app/logo'
import { Heading } from '@/components/heading'
import { Text, TextLink } from '@/components/text'
import { useAuth } from '@/lib/auth-context'
import { getVendorQuoteRequests } from '@/lib/api/quote-request'
import { QuoteRequest, QuoteStatus } from '@/type'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'

export default function VendorQuotesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<QuoteStatus | 'ALL'>('ALL')

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user && !user.roles?.includes('VENDOR')) {
      router.push('/')
      return
    }

    loadQuoteRequests()
  }, [authLoading, isAuthenticated, user, router])

  const loadQuoteRequests = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const quotes = await getVendorQuoteRequests()
      setQuoteRequests(quotes)
    } catch (err) {
      console.error('Error loading quote requests:', err)
      setError(err instanceof Error ? err.message : 'Failed to load quote requests.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Open
          </span>
        )
      case 'QUOTED':
        return (
          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Quoted
          </span>
        )
      case 'ACCEPTED':
        return (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            Accepted
          </span>
        )
      case 'DECLINED':
        return (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
            Declined
          </span>
        )
      default:
        return null
    }
  }

  const filteredQuotes = filterStatus === 'ALL' 
    ? quoteRequests 
    : quoteRequests.filter(q => q.status === filterStatus)

  if (isLoading) {
    return (
      <div className="container py-10">
        <Text>Loading quote requests...</Text>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <Heading level={1} className="text-3xl font-semibold text-text">
          Quote Requests
        </Heading>
        <TextLink href="/vendor-dashboard" className="text-sm font-semibold text-accent">
          Dashboard
        </TextLink>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <Text className="text-sm text-red-700">{error}</Text>
        </div>
      )}

      {/* Filter buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={clsx(
            'rounded-full px-4 py-1.5 text-sm font-medium transition',
            filterStatus === 'ALL'
              ? 'bg-rose-600 text-white'
              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
          )}
        >
          All
        </button>
        {(['OPEN', 'QUOTED', 'ACCEPTED', 'DECLINED'] as QuoteStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={clsx(
              'rounded-full px-4 py-1.5 text-sm font-medium transition',
              filterStatus === status
                ? 'bg-rose-600 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredQuotes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-primary/40 bg-white p-6 text-center">
          <Text className="text-sm text-zinc-600">
            {filterStatus === 'ALL' 
              ? 'No quote requests yet. Clients will see your vendor profile and can request quotes.'
              : `No ${filterStatus.toLowerCase()} quote requests.`}
          </Text>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => (
            <Link
              key={quote.id}
              href={`/quotes/${quote.id}`}
              className="block rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Heading level={2} className="text-lg font-semibold text-text">
                      {quote.clientName}
                    </Heading>
                    {getStatusBadge(quote.status)}
                  </div>
                  <div className="space-y-1 text-sm text-zinc-600">
                    <p>
                      <span className="font-medium">Date:</span> {new Date(quote.weddingDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Guests:</span> {quote.guestCount}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span> {quote.location}
                    </p>
                    {quote.quote && (
                      <p className="text-lg font-semibold text-rose-600">
                        <span className="font-medium">Quote:</span> ${quote.quote.amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-zinc-500">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </span>
                  {quote.status === 'OPEN' && (
                    <span className="text-xs font-medium text-rose-600">Send Quote</span>
                  )}
                  {quote.status === 'QUOTED' && (
                    <span className="text-xs font-medium text-yellow-600">Update Quote</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

