'use client'

import { TBudgetCategory, TBudgetExpense } from '@/type'
import { XMarkIcon, CheckCircleIcon, CalendarDaysIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

interface EnhancedExpenseModalProps {
  categories: TBudgetCategory[]
  selectedCategoryId?: string | null
  expense?: TBudgetExpense | null // For editing
  onClose: () => void
  onSave: (expense: Omit<TBudgetExpense, 'id'>) => void
}

type RecurringType = 'one-time' | 'weekly' | 'monthly'

export default function EnhancedExpenseModal({
  categories,
  selectedCategoryId,
  expense,
  onClose,
  onSave,
}: EnhancedExpenseModalProps) {
  const isEditing = !!expense
  
  const [categoryId, setCategoryId] = useState(
    selectedCategoryId || expense?.categoryId || categories[0]?.id || ''
  )
  const [description, setDescription] = useState(expense?.description || '')
  const [amount, setAmount] = useState(expense?.amount.toString() || '')
  const [vendorName, setVendorName] = useState(expense?.vendorName || '')
  const [isPaid, setIsPaid] = useState(expense?.isPaid || false)
  const [date, setDate] = useState(
    expense?.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0]
  )
  const [tags, setTags] = useState<string>('') // Comma-separated tags (UI only for now)
  const [paymentMethod, setPaymentMethod] = useState<string>('') // UI only
  const [recurringType, setRecurringType] = useState<RecurringType>('one-time') // UI only

  // Quick date selectors
  const quickDates = {
    today: new Date().toISOString().split('T')[0],
    yesterday: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    tomorrow: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    '1 week': new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    '1 month': new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId || !description || !amount) return

    onSave({
      categoryId,
      description,
      amount: Number(amount),
      vendorName: vendorName || undefined,
      isPaid,
      date,
    })
    
    // Reset form if not editing
    if (!isEditing) {
      setDescription('')
      setAmount('')
      setVendorName('')
      setIsPaid(false)
      setDate(new Date().toISOString().split('T')[0])
      setTags('')
      setPaymentMethod('')
      setRecurringType('one-time')
    }
  }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-surface shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-primary/10 px-6 py-4">
            <h3 className="text-xl font-semibold text-text">
              {isEditing ? 'Edit Expense' : 'Add Expense'}
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-text/40 hover:bg-primary/10 hover:text-text transition"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-5">
              {/* Category */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-text/50">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-text/50">
                  Description *
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Venue deposit, Catering service, etc."
                  required
                  className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-text/50">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text/50 text-lg">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full rounded-xl border border-primary/20 bg-background pl-10 pr-4 py-3 text-lg font-medium text-text placeholder:text-text/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Two columns for vendor and date */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Vendor */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-text/50">
                    Vendor (optional)
                  </label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="e.g. The Grand Ballroom"
                    className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Date with quick select */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-text/50">
                    Date *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(quickDates).map(([label, dateValue]) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setDate(dateValue)}
                          className={clsx(
                            'px-2.5 py-1 rounded-lg text-xs font-medium transition',
                            date === dateValue
                              ? 'bg-primary text-background'
                              : 'bg-surface border border-primary/20 text-text hover:bg-primary/10'
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recurring expense (UI only) */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-text/50">
                  Recurring Expense
                </label>
                <div className="flex gap-2">
                  {(['one-time', 'weekly', 'monthly'] as RecurringType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRecurringType(type)}
                      className={clsx(
                        'flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition capitalize',
                        recurringType === type
                          ? 'bg-primary text-background'
                          : 'bg-surface border border-primary/20 text-text hover:bg-primary/10'
                      )}
                    >
                      {type === 'one-time' ? 'One Time' : type}
                    </button>
                  ))}
                </div>
                {recurringType !== 'one-time' && (
                  <p className="mt-2 text-xs text-text/50 italic">
                    Note: Recurring expenses are shown for planning. Each instance will need to be added separately.
                  </p>
                )}
              </div>

              {/* Payment method (UI only) */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-text/50">
                  Payment Method (optional)
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select payment method</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Tags (UI only) */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-text/50">
                  Tags (optional)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. deposit, urgent, decor (comma-separated)"
                  className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Payment status */}
              <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-surface/50 p-4">
                <button
                  type="button"
                  onClick={() => setIsPaid(!isPaid)}
                  className={clsx(
                    'flex h-6 w-6 items-center justify-center rounded-lg border-2 transition shrink-0',
                    isPaid
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-primary/30 bg-background'
                  )}
                >
                  {isPaid && <CheckCircleIcon className="h-4 w-4" />}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">
                    {isPaid ? 'Payment completed' : 'Payment pending'}
                  </p>
                  <p className="text-xs text-text/50">
                    {isPaid
                      ? 'This expense has been paid'
                      : 'Mark this expense as paid when payment is completed'}
                  </p>
                </div>
              </div>
            </div>
          </form>

          {/* Footer with actions */}
          <div className="border-t border-primary/10 px-6 py-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm font-semibold text-text transition hover:bg-primary/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-background transition hover:bg-primary/90"
            >
              {isEditing ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}


