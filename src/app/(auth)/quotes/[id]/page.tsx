'use client'

import { Logo } from '@/app/logo'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { useAuth } from '@/lib/auth-context'
import { 
  getQuoteRequestById, 
  acceptQuote, 
  declineQuote, 
  createBooking,
  addMessage,
  createOrUpdateQuote,
  type AddQuoteMessagePayload,
  type CreateOrUpdateQuotePayload
} from '@/lib/api/quote-request'
import { QuoteRequest, AuthorRole } from '@/type'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'

export default function QuoteDetailPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const quoteId = Number(params.id)
  
  const [isLoading, setIsLoading] = useState(true)
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [quoteAmount, setQuoteAmount] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')
  const [showQuoteForm, setShowQuoteForm] = useState(false)

  // Check if user is the client or vendor for THIS specific quote request
  // Only show client actions if the user is actually the client for this quote
  const isClientForThisQuote = quoteRequest && user ? quoteRequest.clientId === user.id : false
  const isVendorForThisQuote = quoteRequest && user ? user.roles?.includes('VENDOR') ?? false : false
  
  // Use actual relationship check for client, role check for vendor (backend validates anyway)
  const isClient = isClientForThisQuote
  const isVendor = isVendorForThisQuote

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (quoteId) {
      loadQuoteRequest()
    }
  }, [authLoading, isAuthenticated, quoteId, router])

  const loadQuoteRequest = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const quote = await getQuoteRequestById(quoteId)
      setQuoteRequest(quote)
      if (quote.quote) {
        setQuoteAmount(quote.quote.amount.toString())
        setQuoteNotes(quote.quote.notes || '')
      }
    } catch (err) {
      console.error('Error loading quote request:', err)
      setError(err instanceof Error ? err.message : 'Failed to load quote request.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptQuote = async () => {
    if (!confirm('Are you sure you want to accept this quote?')) return
    
    setIsProcessing(true)
    try {
      await acceptQuote(quoteId)
      await loadQuoteRequest()
    } catch (err) {
      console.error('Error accepting quote:', err)
      setError(err instanceof Error ? err.message : 'Failed to accept quote.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeclineQuote = async () => {
    if (!confirm('Are you sure you want to decline this quote?')) return
    
    setIsProcessing(true)
    try {
      await declineQuote(quoteId)
      await loadQuoteRequest()
    } catch (err) {
      console.error('Error declining quote:', err)
      setError(err instanceof Error ? err.message : 'Failed to decline quote.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreateBooking = async () => {
    if (!confirm('Create booking for this quote? This will confirm your booking with the vendor.')) return
    
    setIsProcessing(true)
    try {
      await createBooking(quoteId)
      await loadQuoteRequest()
      alert('Booking created successfully!')
    } catch (err) {
      console.error('Error creating booking:', err)
      setError(err instanceof Error ? err.message : 'Failed to create booking.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim()) return
    
    setIsProcessing(true)
    try {
      const payload: AddQuoteMessagePayload = {
        message: messageText,
        // authorRole is automatically determined by the backend
      }
      await addMessage(quoteId, payload)
      setMessageText('')
      await loadQuoteRequest()
    } catch (err) {
      console.error('Error sending message:', err)
      setError(err instanceof Error ? err.message : 'Failed to send message.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmitQuote = async () => {
    if (!quoteAmount || isNaN(Number(quoteAmount))) {
      setError('Please enter a valid quote amount.')
      return
    }
    
    setIsProcessing(true)
    try {
      const payload: CreateOrUpdateQuotePayload = {
        amount: Number(quoteAmount),
        notes: quoteNotes || undefined,
      }
      await createOrUpdateQuote(quoteId, payload)
      setShowQuoteForm(false)
      await loadQuoteRequest()
    } catch (err) {
      console.error('Error submitting quote:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit quote.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <Text>Loading quote request...</Text>
      </div>
    )
  }

  if (!quoteRequest) {
    return (
      <div className="container py-10">
        <Text className="text-red-600">Quote request not found.</Text>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Link href="/quotes" className="text-sm text-rose-600 hover:underline mb-4 inline-block">
        ← Back to Quotes
      </Link>

      <div className="mb-6">
        <Heading level={1} className="text-3xl font-semibold text-text mb-2">
          Quote Request: {quoteRequest.vendorProfileName}
        </Heading>
        <div className="flex items-center gap-2">
          <span className={clsx(
            'rounded-full px-3 py-1 text-sm font-medium',
            quoteRequest.status === 'OPEN' && 'bg-blue-100 text-blue-800',
            quoteRequest.status === 'QUOTED' && 'bg-yellow-100 text-yellow-800',
            quoteRequest.status === 'ACCEPTED' && 'bg-green-100 text-green-800',
            quoteRequest.status === 'DECLINED' && 'bg-red-100 text-red-800'
          )}>
            {quoteRequest.status}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <Text className="text-sm text-red-700">{error}</Text>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Request Details */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <Heading level={2} className="text-xl font-semibold mb-4">Request Details</Heading>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-zinc-700">Wedding Date:</span>{' '}
                <span className="text-zinc-900">{new Date(quoteRequest.weddingDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-700">Guest Count:</span>{' '}
                <span className="text-zinc-900">{quoteRequest.guestCount}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-700">Location:</span>{' '}
                <span className="text-zinc-900">{quoteRequest.location}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-700">Client:</span>{' '}
                <span className="text-zinc-900">{quoteRequest.clientName}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-700">Email:</span>{' '}
                <span className="text-zinc-900">{quoteRequest.email}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-700">Phone:</span>{' '}
                <span className="text-zinc-900">{quoteRequest.phone}</span>
              </div>
            </div>
          </div>

          {/* Answers to Vendor Questions */}
          {quoteRequest.answers && quoteRequest.answers.length > 0 && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <Heading level={2} className="text-xl font-semibold mb-4">Client Answers</Heading>
              <div className="space-y-4">
                {quoteRequest.answers.map((answer) => (
                  <div key={answer.id}>
                    <p className="font-medium text-zinc-800 mb-1">{answer.questionText}</p>
                    <p className="text-sm text-zinc-600">{answer.answerText}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quote Information */}
          {quoteRequest.quote && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <Heading level={2} className="text-xl font-semibold mb-4">Quote</Heading>
              <div className="space-y-3">
                <div>
                  <span className="text-2xl font-bold text-rose-600">
                    ${quoteRequest.quote.amount.toLocaleString()}
                  </span>
                </div>
                {quoteRequest.quote.notes && (
                  <div>
                    <p className="text-sm text-zinc-700 whitespace-pre-wrap">{quoteRequest.quote.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages / Chat */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <Heading level={2} className="text-xl font-semibold mb-4">Messages</Heading>
            
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {quoteRequest.messages && quoteRequest.messages.length > 0 ? (
                quoteRequest.messages.map((message) => {
                  const isClientMessage = message.authorRole === 'CLIENT'
                  return (
                    <div 
                      key={message.id} 
                      className={clsx(
                        "flex",
                        isClientMessage ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className={clsx(
                        "max-w-[80%] rounded-lg px-4 py-2",
                        isClientMessage
                          ? "bg-blue-600 text-white" 
                          : "bg-zinc-100 text-zinc-900"
                      )}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={clsx(
                            "text-xs font-medium",
                            isClientMessage ? "text-blue-100" : "text-zinc-600"
                          )}>
                            {isClientMessage ? 'You' : quoteRequest.vendorProfileName}
                          </span>
                          <span className={clsx(
                            "text-xs",
                            isClientMessage ? "text-blue-200" : "text-zinc-500"
                          )}>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-zinc-500 text-center py-4">No messages yet. Start the conversation!</p>
              )}
            </div>
            <div className="flex gap-2">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none resize-none"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || isProcessing}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition"
              >
                {isProcessing ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          {isVendor && !quoteRequest.booking && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <Heading level={2} className="text-lg font-semibold mb-4">Vendor Actions</Heading>
              {!quoteRequest.quote ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowQuoteForm(true)}
                    className="w-full rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition"
                  >
                    Send Quote
                  </button>
                  <p className="text-xs text-zinc-500 text-center">
                    Review the client&apos;s request and answers, then send your quote.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowQuoteForm(true)}
                    className="w-full rounded-lg bg-zinc-600 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition"
                  >
                    Update Quote
                  </button>
                  <p className="text-xs text-zinc-500 text-center">
                    You can update the quote amount or notes at any time.
                  </p>
                </div>
              )}
            </div>
          )}

          {isClient && quoteRequest.status === 'QUOTED' && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <Heading level={2} className="text-lg font-semibold mb-4">Client Actions</Heading>
              <div className="space-y-3">
                <button
                  onClick={handleAcceptQuote}
                  disabled={isProcessing}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition"
                >
                  Accept Quote
                </button>
                <button
                  onClick={handleDeclineQuote}
                  disabled={isProcessing}
                  className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition"
                >
                  Decline Quote
                </button>
              </div>
            </div>
          )}

          {isClient && quoteRequest.status === 'ACCEPTED' && !quoteRequest.booking && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <Heading level={2} className="text-lg font-semibold mb-4">Create Booking</Heading>
              <button
                onClick={handleCreateBooking}
                disabled={isProcessing}
                className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition"
              >
                Confirm Booking
              </button>
            </div>
          )}

          {quoteRequest.booking && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-6">
              <Heading level={2} className="text-lg font-semibold mb-2 text-green-800">Booking Confirmed</Heading>
              <p className="text-sm text-green-700">
                Your booking has been confirmed. The vendor has been notified.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <Heading level={2} className="text-xl font-semibold">
                {quoteRequest.quote ? 'Update Quote' : 'Send Quote'}
              </Heading>
              <button
                onClick={() => setShowQuoteForm(false)}
                className="text-zinc-500 hover:text-zinc-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Amount *</label>
                <input
                  type="number"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Notes</label>
                <textarea
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder="Additional notes about the quote..."
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none resize-none"
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitQuote}
                  disabled={!quoteAmount || isProcessing}
                  className="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition"
                >
                  {isProcessing ? 'Submitting...' : 'Submit Quote'}
                </button>
                <button
                  onClick={() => setShowQuoteForm(false)}
                  className="flex-1 rounded-lg bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

