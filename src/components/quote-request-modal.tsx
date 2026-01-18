'use client'

import { TVendor, TimeSlot } from '@/type'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { createQuoteRequest } from '@/lib/api/quote-request'
import { getVendorQuestionsByProfile, type VendorQuestionResponse } from '@/lib/api/vendor-profile'
import { useAuth } from '@/lib/auth-context'
import { useWedding } from '@/lib/wedding-context'

interface Props {
  vendor: TVendor
  selectedDate?: string | null
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function QuoteRequestModal({ vendor, selectedDate, open, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const { weddingInfo } = useWedding()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [location, setLocation] = useState('')
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('FULL_DAY')
  const [vendorQuestions, setVendorQuestions] = useState<VendorQuestionResponse[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Extract vendor profile ID from vendor handle or use vendor.id
  const vendorProfileId = Number(vendor.id)

  useEffect(() => {
    if (open && vendorProfileId) {
      loadVendorQuestions()
    }
  }, [open, vendorProfileId])

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
    if (weddingInfo.weddingDate) {
      setWeddingDate(weddingInfo.weddingDate)
    } else if (selectedDate) {
      setWeddingDate(selectedDate)
    }
    if (weddingInfo.location) {
      setLocation(weddingInfo.location)
    }
  }, [user, weddingInfo, selectedDate])

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setTimeout(() => {
        setSuccess(false)
        setError(null)
        setAnswers({})
        setMessage('')
      }, 300)
    }
  }, [open])

  const loadVendorQuestions = async () => {
    setIsLoadingQuestions(true)
    try {
      const questions = await getVendorQuestionsByProfile(vendorProfileId)
      setVendorQuestions(questions)
      // Initialize answers object
      const initialAnswers: Record<number, string> = {}
      questions.forEach((q) => {
        initialAnswers[q.id] = ''
      })
      setAnswers(initialAnswers)
    } catch (err) {
      console.error('Error loading vendor questions:', err)
      setError('Failed to load vendor questions. Please try again.')
    } finally {
      setIsLoadingQuestions(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required questions
    const requiredQuestions = vendorQuestions.filter((q) => q.required)
    const missingAnswers = requiredQuestions.filter((q) => !answers[q.id] || answers[q.id].trim() === '')
    
    if (missingAnswers.length > 0) {
      setError(`Please answer all required questions.`)
      return
    }

    if (!weddingDate || !guestCount || !location || !timeSlot) {
      setError('Please fill in all required fields.')
      return
    }

    setIsLoading(true)
    try {
      // Prepare answers array matching vendor questions order
      const answersArray = vendorQuestions.map((question) => ({
        questionText: question.questionText,
        answerText: answers[question.id] || '',
      }))

      await createQuoteRequest(vendorProfileId, {
        clientName: name,
        email: email,
        phone: phone,
        weddingDate: weddingDate,
        guestCount: parseInt(guestCount, 10),
        location: location,
        timeSlot: timeSlot,
        answers: answersArray,
      })

      setSuccess(true)

      // Close modal after showing success message
      setTimeout(() => {
        onClose()
        onSuccess?.()
      }, 2000)
    } catch (err) {
      console.error('Error creating quote request:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit quote request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formattedDate = weddingDate
    ? new Date(weddingDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
          {success ? (
            <div className="text-center py-6 sm:py-8">
              <div className="mx-auto mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <Dialog.Title className="text-lg sm:text-xl font-bold text-zinc-900">Quote Request Submitted!</Dialog.Title>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed px-2">
                {vendor.name} will review your request and send you a quote. You&apos;ll be notified via WhatsApp.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg sm:text-xl font-bold text-zinc-900">Request Quote</Dialog.Title>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 sm:p-2 text-zinc-500 hover:bg-zinc-100 active:bg-zinc-200 transition-colors touch-manipulation"
                >
                  <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {formattedDate && (
                <div className="mt-3 sm:mt-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 px-3 sm:px-4 py-2.5 sm:py-3 border border-rose-100">
                  <p className="text-sm sm:text-base font-bold text-rose-900">{formattedDate}</p>
                  <p className="text-xs sm:text-sm text-rose-700 mt-0.5">{vendor.name}</p>
                </div>
              )}

              {error && (
                <div className="mt-3 sm:mt-4 rounded-lg bg-red-50 border border-red-200 px-3 sm:px-4 py-2.5 sm:py-3">
                  <p className="text-xs sm:text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                <div>
                  <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="mt-1 w-full rounded-md sm:rounded-lg border border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-rose-500 focus:ring-1 sm:focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="mt-1 w-full rounded-md sm:rounded-lg border border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-rose-500 focus:ring-1 sm:focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    required
                    className="mt-1 w-full rounded-md sm:rounded-lg border border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-rose-500 focus:ring-1 sm:focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">Wedding Date *</label>
                  <input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 w-full rounded-md sm:rounded-lg border border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-rose-500 focus:ring-1 sm:focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">Guest Count *</label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    placeholder="100"
                    required
                    min="1"
                    className="mt-1 w-full rounded-md sm:rounded-lg border border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-rose-500 focus:ring-1 sm:focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">Location *</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Wedding venue location"
                    required
                    className="mt-1 w-full rounded-md sm:rounded-lg border border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-rose-500 focus:ring-1 sm:focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">Time Slot *</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
                    required
                    className="mt-1 w-full rounded-md sm:rounded-lg border border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-rose-500 focus:ring-1 sm:focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all"
                  >
                    <option value="MORNING">Morning</option>
                    <option value="NIGHT">Night</option>
                    <option value="FULL_DAY">Full Day</option>
                  </select>
                </div>

                {isLoadingQuestions ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-zinc-600">Loading vendor questions...</p>
                  </div>
                ) : vendorQuestions.length > 0 ? (
                  <div>
                    <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">
                      Vendor Questions *
                    </label>
                    <div className="mt-2 space-y-3">
                      {vendorQuestions.map((question) => (
                        <div key={question.id}>
                          <label className="block text-xs sm:text-sm font-medium text-zinc-800 mb-1">
                            {question.questionText}
                            {question.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <textarea
                            value={answers[question.id] || ''}
                            onChange={(e) => setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))}
                            placeholder="Your answer..."
                            required={question.required}
                            className="w-full rounded-md sm:rounded-lg border border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-rose-500 focus:ring-1 sm:focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all resize-none"
                            rows={3}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div>
                  <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any additional information or special requirements..."
                    className="mt-1 w-full rounded-md sm:rounded-lg border border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-rose-500 focus:ring-1 sm:focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all resize-none"
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isLoadingQuestions}
                  className="mt-4 sm:mt-5 w-full rounded-md sm:rounded-lg bg-rose-600 px-4 py-2.5 sm:py-3 text-sm font-bold text-white hover:bg-rose-700 active:bg-rose-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md touch-manipulation"
                >
                  {isLoading ? 'Submitting...' : 'Submit Quote Request'}
                </button>
              </form>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

