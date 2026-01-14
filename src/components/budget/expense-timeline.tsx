'use client'

import { TBudgetExpense, TBudgetCategory } from '@/type'
import { formatCurrency } from '@/lib/budget-manager'
import { CheckCircleIcon, ClockIcon, TrashIcon, PencilIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useState, useMemo } from 'react'
import { format, parseISO, isSameMonth, startOfMonth, endOfMonth } from 'date-fns'

interface ExpenseTimelineProps {
  expenses: TBudgetExpense[]
  categories: TBudgetCategory[]
  onEditExpense?: (expense: TBudgetExpense) => void
  onDeleteExpense?: (expenseId: string) => void
}

type FilterType = 'all' | 'paid' | 'pending' | string // string is categoryId

export default function ExpenseTimeline({
  expenses,
  categories,
  onEditExpense,
  onDeleteExpense,
}: ExpenseTimelineProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())

  // Group expenses by month
  const groupedExpenses = useMemo(() => {
    const filtered = expenses.filter((exp) => {
      if (filter === 'all') return true
      if (filter === 'paid') return exp.isPaid
      if (filter === 'pending') return !exp.isPaid
      return exp.categoryId === filter
    })

    const grouped = new Map<string, TBudgetExpense[]>()
    
    filtered.forEach((exp) => {
      const date = parseISO(exp.date)
      const monthKey = format(date, 'yyyy-MM')
      const monthLabel = format(date, 'MMMM yyyy')
      
      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, [])
      }
      grouped.get(monthKey)!.push(exp)
    })

    // Sort by date (newest first)
    const sorted = Array.from(grouped.entries()).sort((a, b) => b[0].localeCompare(a[0]))
    
    return sorted.map(([monthKey, exps]) => ({
      monthKey,
      monthLabel: format(parseISO(exps[0].date), 'MMMM yyyy'),
      expenses: exps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      total: exps.reduce((sum, exp) => sum + exp.amount, 0),
    }))
  }, [expenses, filter])

  const toggleMonth = (monthKey: string) => {
    const next = new Set(expandedMonths)
    if (next.has(monthKey)) {
      next.delete(monthKey)
    } else {
      next.add(monthKey)
    }
    setExpandedMonths(next)
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown'
  }

  const totalFiltered = groupedExpenses.reduce((sum, group) => sum + group.total, 0)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-text/60">Filter:</span>
        <button
          onClick={() => setFilter('all')}
          className={clsx(
            'rounded-full px-4 py-1.5 text-xs font-medium transition',
            filter === 'all'
              ? 'bg-primary text-background'
              : 'bg-surface border border-primary/20 text-text hover:bg-primary/10'
          )}
        >
          All
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={clsx(
            'rounded-full px-4 py-1.5 text-xs font-medium transition',
            filter === 'paid'
              ? 'bg-green-500 text-white'
              : 'bg-surface border border-primary/20 text-text hover:bg-green-500/10'
          )}
        >
          Paid
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={clsx(
            'rounded-full px-4 py-1.5 text-xs font-medium transition',
            filter === 'pending'
              ? 'bg-amber-500 text-white'
              : 'bg-surface border border-primary/20 text-text hover:bg-amber-500/10'
          )}
        >
          Pending
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={clsx(
              'rounded-full px-4 py-1.5 text-xs font-medium transition',
              filter === cat.id
                ? 'bg-primary text-background'
                : 'bg-surface border border-primary/20 text-text hover:bg-primary/10'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {groupedExpenses.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-primary/10 bg-surface/50 px-4 py-3">
            <span className="text-sm font-medium text-text/60">
              {groupedExpenses.length} {groupedExpenses.length === 1 ? 'period' : 'periods'} •{' '}
              {expenses.filter((e) => {
                if (filter === 'all') return true
                if (filter === 'paid') return e.isPaid
                if (filter === 'pending') return !e.isPaid
                return e.categoryId === filter
              }).length}{' '}
              expenses
            </span>
            <span className="text-lg font-bold text-text">
              {formatCurrency(totalFiltered)}
            </span>
          </div>

          {groupedExpenses.map((group) => {
            const isExpanded = expandedMonths.has(group.monthKey)
            return (
              <motion.div
                key={group.monthKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-primary/10 bg-surface overflow-hidden"
              >
                <button
                  onClick={() => toggleMonth(group.monthKey)}
                  className="flex w-full items-center justify-between p-4 transition hover:bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    <CalendarDaysIcon className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <h3 className="font-semibold text-text">{group.monthLabel}</h3>
                      <p className="text-xs text-text/50">
                        {group.expenses.length} {group.expenses.length === 1 ? 'expense' : 'expenses'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-text">{formatCurrency(group.total)}</span>
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                      {isExpanded ? '−' : '+'}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-primary/10 bg-background/50"
                    >
                      <div className="divide-y divide-primary/5">
                        {group.expenses.map((expense) => (
                          <div
                            key={expense.id}
                            className="flex items-center justify-between gap-4 p-4 transition hover:bg-primary/5"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div
                                className={clsx(
                                  'shrink-0 h-3 w-3 rounded-full',
                                  expense.isPaid ? 'bg-green-500' : 'bg-amber-500'
                                )}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-text truncate">{expense.description}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="text-xs text-text/50">
                                    {getCategoryName(expense.categoryId)}
                                  </span>
                                  {expense.vendorName && (
                                    <>
                                      <span className="text-text/30">•</span>
                                      <span className="text-xs text-text/50 truncate">{expense.vendorName}</span>
                                    </>
                                  )}
                                  <span className="text-text/30">•</span>
                                  <span className="text-xs text-text/50">
                                    {format(parseISO(expense.date), 'MMM d, yyyy')}
                                  </span>
                                  <span className="text-text/30">•</span>
                                  <span
                                    className={clsx(
                                      'text-xs font-medium',
                                      expense.isPaid ? 'text-green-500' : 'text-amber-500'
                                    )}
                                  >
                                    {expense.isPaid ? 'Paid' : 'Pending'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-base font-bold text-text">
                                {formatCurrency(expense.amount)}
                              </span>
                              {onEditExpense && (
                                <button
                                  onClick={() => onEditExpense(expense)}
                                  className="rounded-lg p-1.5 text-text/40 hover:bg-primary/10 hover:text-primary transition"
                                  aria-label="Edit expense"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                              )}
                              {onDeleteExpense && (
                                <button
                                  onClick={() => onDeleteExpense(expense.id)}
                                  className="rounded-lg p-1.5 text-text/40 hover:bg-red-500/10 hover:text-red-500 transition"
                                  aria-label="Delete expense"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-primary/20 bg-surface/50 p-12 text-center">
          <ClockIcon className="mx-auto h-12 w-12 text-primary/40" />
          <h3 className="mt-4 text-lg font-semibold text-text">No expenses found</h3>
          <p className="mt-2 text-sm text-text/60">
            {filter === 'all'
              ? 'Start tracking your wedding expenses to see them here.'
              : 'No expenses match your current filter.'}
          </p>
        </div>
      )}
    </div>
  )
}

