'use client'

import { useState, useEffect } from 'react'
import { Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Textarea } from '@/components/textarea'
import { Button } from '@/components/button'
import { Text } from '@/components/text'
import { createQuoteRequest } from '@/lib/api/quote-request'
import { getVendorQuestionsByProfile, type VendorQuestionResponse } from '@/lib/api/vendor-profile'
import { useAuth } from '@/lib/auth-context'
import { useWedding } from '@/lib/wedding-context'
import { TimeSlot } from '@/type'

interface QuoteRequestFormProps {
  vendorProfileId: number | null
  vendorName: string
  onClose: () => void
}

export default function QuoteRequestForm({ vendorProfileId, vendorName, onClose }: QuoteRequestFormProps) {
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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (vendorProfileId) {
      loadVendorQuestions()
    }
  }, [vendorProfileId])

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
    if (weddingInfo.weddingDate) {
      setWeddingDate(weddingInfo.weddingDate)
    }
    if (weddingInfo.location) {
      setLocation(weddingInfo.location)
    }
  }, [user, weddingInfo])

  const loadVendorQuestions = async () => {
    if (!vendorProfileId) return
    setIsLoadingQuestions(true)
    try {
      const questions = await getVendorQuestionsByProfile(vendorProfileId)
      setVendorQuestions(questions)
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
    if (!vendorProfileId) return

    setError(null)

    const requiredQuestions = vendorQuestions.filter((q) => q.required)
    const missingAnswers = requiredQuestions.filter((q) => !answers[q.id] || answers[q.id].trim() === '')
    
    if (missingAnswers.length > 0) {
      setError('Please answer all required questions.')
      return
    }

    if (!weddingDate || !guestCount || !location || !timeSlot) {
      setError('Please fill in all required fields.')
      return
    }

    setIsLoading(true)
    try {
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

      // Close modal on success
      onClose()
    } catch (err) {
      console.error('Error creating quote request:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit quote request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <Text className="text-sm text-red-700">{error}</Text>
        </div>
      )}

      <Field>
        <Label>Name *</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Field>

      <Field>
        <Label>Email *</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Field>

      <Field>
        <Label>Phone *</Label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </Field>

      <Field>
        <Label>Wedding Date *</Label>
        <Input
          type="date"
          value={weddingDate}
          onChange={(e) => setWeddingDate(e.target.value)}
          required
          min={new Date().toISOString().split('T')[0]}
        />
      </Field>

      <Field>
        <Label>Guest Count *</Label>
        <Input
          type="number"
          value={guestCount}
          onChange={(e) => setGuestCount(e.target.value)}
          required
          min="1"
        />
      </Field>

      <Field>
        <Label>Location *</Label>
        <Input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </Field>

      <Field>
        <Label>Time Slot *</Label>
        <select
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
          required
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        >
          <option value="MORNING">Morning</option>
          <option value="NIGHT">Night</option>
          <option value="FULL_DAY">Full Day</option>
        </select>
      </Field>

      {isLoadingQuestions ? (
        <div className="text-center py-4">
          <Text className="text-sm text-text/70">Loading vendor questions...</Text>
        </div>
      ) : vendorQuestions.length > 0 ? (
        <div className="space-y-4">
          <Label>Vendor Questions *</Label>
          {vendorQuestions.map((question) => (
            <Field key={question.id}>
              <Label>
                {question.questionText}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Textarea
                value={answers[question.id] || ''}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))}
                required={question.required}
                rows={3}
              />
            </Field>
          ))}
        </div>
      ) : null}

      <Field>
        <Label>Additional Message (Optional)</Label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
      </Field>

      <Button type="submit" color="accent" className="w-full" disabled={isLoading || isLoadingQuestions}>
        {isLoading ? 'Submitting...' : 'Submit Quote Request'}
      </Button>
    </form>
  )
}

