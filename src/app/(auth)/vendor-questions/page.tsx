'use client'

import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Textarea } from '@/components/textarea'
import { Text, TextLink } from '@/components/text'
import { useAuth } from '@/lib/auth-context'
import {
  createVendorQuestion,
  deleteVendorQuestion,
  getMyVendorQuestions,
  updateVendorQuestion,
  type VendorQuestionRequest,
  type VendorQuestionResponse,
} from '@/lib/api/vendor-profile'
import { getMyVendorProfile } from '@/lib/api/vendor-profile'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function VendorQuestionsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<VendorQuestionResponse[]>([])
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null)
  const [hasProfile, setHasProfile] = useState(false)

  const [formData, setFormData] = useState<VendorQuestionRequest>({
    questionText: '',
    required: false,
    displayOrder: undefined,
  })

  // Check if user is authenticated and has VENDOR role
  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user && !user.roles?.includes('VENDOR')) {
      router.push('/subscription')
      return
    }

    // Check if vendor has a profile
    checkProfileAndLoadQuestions()
  }, [authLoading, isAuthenticated, user, router])

  const checkProfileAndLoadQuestions = async () => {
    setIsLoadingQuestions(true)
    try {
      const profile = await getMyVendorProfile()
      if (!profile) {
        // No profile exists, redirect to create profile
        router.push('/vendor-profile')
        return
      }
      setHasProfile(true)
      await loadQuestions()
    } catch (err) {
      console.error('Error checking profile:', err)
      // Only redirect if it's a 404 (not found), not for other errors
      const errorMessage = err instanceof Error ? err.message : String(err)
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        router.push('/vendor-profile')
      } else {
        // For other errors, show error but don't redirect
        setError('Failed to load profile. Please try refreshing the page.')
      }
    } finally {
      setIsLoadingQuestions(false)
    }
  }

  const loadQuestions = async () => {
    try {
      const questionsData = await getMyVendorQuestions()
      setQuestions(questionsData)
    } catch (err) {
      console.error('Error loading questions:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, required: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (editingQuestion !== null) {
        // Update existing question
        await updateVendorQuestion(editingQuestion, formData)
      } else {
        // Create new question
        await createVendorQuestion(formData)
      }

      // Reset form
      setFormData({
        questionText: '',
        required: false,
        displayOrder: undefined,
      })
      setEditingQuestion(null)
      await loadQuestions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save question. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (question: VendorQuestionResponse) => {
    setFormData({
      questionText: question.questionText,
      required: question.required,
      displayOrder: question.displayOrder,
    })
    setEditingQuestion(question.id)
  }

  const handleCancelEdit = () => {
    setFormData({
      questionText: '',
      required: false,
      displayOrder: undefined,
    })
    setEditingQuestion(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return
    }

    setIsLoading(true)
    try {
      await deleteVendorQuestion(id)
      await loadQuestions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    // Redirect to vendor dashboard or home
    router.push('/vendor-dashboard')
    router.refresh()
  }

  if (authLoading || isLoadingQuestions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Text>Loading...</Text>
      </div>
    )
  }

  if (!isAuthenticated || !hasProfile) {
    return null // Will redirect
  }

  // Get subscription info to check max questions
  // For now, we'll show a message if they try to add more than allowed
  const maxQuestions = 5 // FOUNDING tier allows 5 questions

  return (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-8">
      <div>
        <Link href="/">
          <Logo className="text-text" />
        </Link>
        <Text className="mt-5 text-text/70">
          Add common questions that couples will answer when requesting a quote from you. You can add up to {maxQuestions} questions.
        </Text>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <Text className="text-sm text-red-800 dark:text-red-200">{error}</Text>
        </div>
      )}

      {/* Add/Edit Question Form */}
      <div className="rounded-lg border border-text/20 bg-surface p-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingQuestion !== null ? 'Edit Question' : 'Add New Question'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <Label>Question Text *</Label>
            <Textarea
              name="questionText"
              value={formData.questionText}
              onChange={handleChange}
              required
              rows={3}
              placeholder="e.g., What is your preferred wedding theme?"
            />
          </Field>

          <div className="flex items-center gap-4">
            <CheckboxField>
              <Checkbox
                checked={formData.required || false}
                onChange={handleCheckboxChange}
              />
              <Label>Required</Label>
            </CheckboxField>

            {editingQuestion !== null && (
              <Field>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="Auto"
                />
              </Field>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading || questions.length >= maxQuestions}>
              {isLoading ? 'Saving...' : editingQuestion !== null ? 'Update Question' : 'Add Question'}
            </Button>
            {editingQuestion !== null && (
              <Button type="button" onClick={handleCancelEdit} outline disabled={isLoading}>
                Cancel
              </Button>
            )}
          </div>

          {questions.length >= maxQuestions && editingQuestion === null && (
            <Text className="text-sm text-amber-600 dark:text-amber-400">
              You have reached the maximum number of questions ({maxQuestions}). Edit or delete existing questions to add new ones.
            </Text>
          )}
        </form>
      </div>

      {/* Existing Questions List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Questions ({questions.length}/{maxQuestions})</h2>
        {questions.length === 0 ? (
          <div className="rounded-lg border border-text/20 bg-zinc-100 dark:bg-zinc-800 p-6 text-center">
            <Text className="text-text/70">No questions added yet. Add your first question above.</Text>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="flex items-start justify-between rounded-lg border border-text/20 bg-surface p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-text/50">#{index + 1}</span>
                    {question.required && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Required
                      </span>
                    )}
                  </div>
                  <Text className="text-text">{question.questionText}</Text>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    type="button"
                    onClick={() => handleEdit(question)}
                    outline
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleDelete(question.id)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button onClick={handleContinue} disabled={isLoading}>
          Continue to Dashboard
        </Button>
      </div>
    </div>
  )
}

