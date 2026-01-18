'use client'

import { useWedding } from '@/lib/wedding-context'
import { getBudgetSummary, getBudgetAlerts, formatCurrency } from '@/lib/budget-manager'
import BudgetOverviewCards from '@/components/budget/budget-overview-cards'
import BudgetCharts from '@/components/budget/budget-charts'
import BudgetAlerts from '@/components/budget/budget-alerts'
import BudgetExport from '@/components/budget/budget-export'
import ExpenseTimeline from '@/components/budget/expense-timeline'
import EnhancedExpenseModal from '@/components/budget/enhanced-expense-modal'
import { TBudgetExpense } from '@/type'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BanknotesIcon, 
  PlusIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import clsx from 'clsx'

export default function BudgetClient() {
  const {
    weddingInfo,
    budgetCategories,
    budgetExpenses,
    updateBudgetCategory,
    addBudgetExpense,
    updateBudgetExpense,
    deleteBudgetExpense,
    refreshBudget,
  } = useWedding()

  const totalBudget = weddingInfo.totalBudget || 0
  const budgetSummary = getBudgetSummary(budgetCategories, totalBudget)
  const alerts = getBudgetAlerts(budgetCategories)

  // State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [editingExpense, setEditingExpense] = useState<TBudgetExpense | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [activeView, setActiveView] = useState<'overview' | 'timeline' | 'charts'>('overview')

  const handleAddExpense = (expense: Omit<TBudgetExpense, 'id'>) => {
    addBudgetExpense(expense)
    setIsExpenseModalOpen(false)
    setSelectedCategoryId(null)
    refreshBudget()
  }

  const handleUpdateExpense = (expense: Omit<TBudgetExpense, 'id'>) => {
    if (editingExpense) {
      updateBudgetExpense(editingExpense.id, expense)
      setEditingExpense(null)
      setIsExpenseModalOpen(false)
      refreshBudget()
    }
  }

  const handleEditExpense = (expense: TBudgetExpense) => {
    setEditingExpense(expense)
    setIsExpenseModalOpen(true)
  }

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteBudgetExpense(expenseId)
      refreshBudget()
    }
  }

  const toggleCategory = (categoryId: string) => {
    const next = new Set(expandedCategories)
    if (next.has(categoryId)) {
      next.delete(categoryId)
    } else {
      next.add(categoryId)
    }
    setExpandedCategories(next)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="container pt-24 pb-8 lg:pt-28">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/my-wedding"
            className="rounded-lg p-2 text-text/60 hover:bg-primary/10 hover:text-primary transition"
            aria-label="Back to dashboard"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-text sm:text-5xl">Budget Planner</h1>
            <p className="mt-2 text-sm text-text/60">
              Track and manage your wedding expenses with detailed insights
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveView('overview')}
              className={clsx(
                'rounded-full px-4 py-2 text-sm font-medium transition',
                activeView === 'overview'
                  ? 'bg-primary text-background'
                  : 'bg-surface border border-primary/20 text-text hover:bg-primary/10'
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('charts')}
              className={clsx(
                'rounded-full px-4 py-2 text-sm font-medium transition',
                activeView === 'charts'
                  ? 'bg-primary text-background'
                  : 'bg-surface border border-primary/20 text-text hover:bg-primary/10'
              )}
            >
              Charts
            </button>
            <button
              onClick={() => setActiveView('timeline')}
              className={clsx(
                'rounded-full px-4 py-2 text-sm font-medium transition',
                activeView === 'timeline'
                  ? 'bg-primary text-background'
                  : 'bg-surface border border-primary/20 text-text hover:bg-primary/10'
              )}
            >
              Timeline
            </button>
          </div>

          <div className="flex items-center gap-3">
            {totalBudget > 0 && (
              <BudgetExport
                categories={budgetCategories}
                expenses={budgetExpenses}
                totalBudget={totalBudget}
                weddingInfo={weddingInfo}
              />
            )}
            <button
              onClick={() => {
                setEditingExpense(null)
                setSelectedCategoryId(null)
                setIsExpenseModalOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-primary/90"
            >
              <PlusIcon className="h-4 w-4" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Budget Alerts */}
        {alerts.length > 0 && (
          <BudgetAlerts
            alerts={alerts}
            onCategoryClick={(categoryId) => {
              setExpandedCategories(new Set([categoryId]))
              setActiveView('overview')
            }}
          />
        )}

        {/* Empty State - No Budget Set */}
        {totalBudget === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-dashed border-primary/20 bg-surface/50 p-12 text-center"
          >
            <BanknotesIcon className="mx-auto h-16 w-16 text-primary/40" />
            <h2 className="mt-4 text-2xl font-semibold text-text">Set Your Wedding Budget</h2>
            <p className="mt-2 text-sm text-text/60 max-w-md mx-auto">
              Start planning your wedding budget by setting your total budget. We&apos;ll help you
              allocate funds across different categories and track your expenses.
            </p>
            <Link
              href="/my-wedding"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background transition hover:bg-primary/90"
            >
              Go to Dashboard to Set Budget
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </motion.div>
        )}

        {/* Budget Content */}
        {totalBudget > 0 && (
          <div className="space-y-8">
            {/* Overview Cards */}
            {(activeView === 'overview' || activeView === 'charts') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BudgetOverviewCards
                  totalBudget={totalBudget}
                  totalSpent={budgetSummary.totalSpent}
                  remaining={budgetSummary.remaining}
                  unallocated={budgetSummary.unallocated}
                  percentSpent={budgetSummary.percentSpent}
                />
              </motion.div>
            )}

            {/* Overall Progress Bar */}
            {activeView === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="rounded-2xl border border-primary/10 bg-gradient-to-br from-surface to-surface/50 p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-base font-semibold text-text">Overall Budget Progress</span>
                  <span className="text-sm text-text/60">
                    {formatCurrency(budgetSummary.totalSpent)} of {formatCurrency(totalBudget)}
                  </span>
                </div>
                <div className="h-6 w-full overflow-hidden rounded-full bg-background shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(budgetSummary.percentSpent, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={clsx(
                      'h-full rounded-full transition-all',
                      budgetSummary.percentSpent > 100
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : budgetSummary.percentSpent > 80
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                        : 'bg-gradient-to-r from-primary to-primary/80'
                    )}
                  />
                </div>
                {budgetSummary.percentSpent > 100 && (
                  <p className="mt-3 text-sm font-medium text-red-500">
                    ⚠️ You&apos;re over budget by {formatCurrency(budgetSummary.totalSpent - totalBudget)}
                  </p>
                )}
              </motion.div>
            )}

            {/* Charts View */}
            {activeView === 'charts' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <BudgetCharts categories={budgetCategories} totalBudget={totalBudget} />
              </motion.div>
            )}

            {/* Categories List - Overview */}
            {activeView === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="rounded-2xl border border-primary/10 bg-surface overflow-hidden"
              >
                <div className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text">Budget Categories</h3>
                    <button
                      onClick={() => {
                        setSelectedCategoryId(null)
                        setIsExpenseModalOpen(true)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
                    >
                      <PlusIcon className="h-3.5 w-3.5" />
                      Add Expense
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-primary/5">
                  {budgetCategories.map((category) => {
                    const categoryExpenses = budgetExpenses.filter((e) => e.categoryId === category.id)
                    const isExpanded = expandedCategories.has(category.id)
                    const percentUsed =
                      category.allocatedAmount > 0
                        ? (category.spentAmount / category.allocatedAmount) * 100
                        : 0

                    return (
                      <div key={category.id} className="group">
                        <div
                          className="flex cursor-pointer items-center gap-4 p-4 transition hover:bg-primary/5"
                          onClick={() => toggleCategory(category.id)}
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                            <CategoryIcon icon={category.icon} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-text">{category.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-text/60">
                                  {formatCurrency(category.spentAmount)}
                                  <span className="text-text/40"> / </span>
                                  {category.allocatedAmount > 0
                                    ? formatCurrency(category.allocatedAmount)
                                    : '--'}
                                </span>
                                <span
                                  className={clsx(
                                    'text-xs font-medium px-2 py-1 rounded-full',
                                    percentUsed > 100
                                      ? 'bg-red-500/10 text-red-500'
                                      : percentUsed >= 80
                                      ? 'bg-amber-500/10 text-amber-500'
                                      : 'bg-green-500/10 text-green-500'
                                  )}
                                >
                                  {percentUsed > 0 ? `${percentUsed.toFixed(0)}%` : '0%'}
                                </span>
                              </div>
                            </div>

                            <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                              <div
                                className={clsx(
                                  'h-full rounded-full transition-all',
                                  percentUsed > 100
                                    ? 'bg-red-500'
                                    : percentUsed > 80
                                    ? 'bg-amber-500'
                                    : 'bg-primary/60'
                                )}
                                style={{ width: `${Math.min(percentUsed, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-primary/5 bg-background/50 px-4 pb-4">
                            {/* Category allocation editor */}
                            <div className="mb-4 flex items-center gap-3 pt-4">
                              <label className="text-xs text-text/50 shrink-0 w-24">Allocated:</label>
                              <div className="relative flex-1 max-w-[200px]">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50 text-sm">
                                  $
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="100"
                                  value={category.allocatedAmount || ''}
                                  onChange={(e) =>
                                    updateBudgetCategory(category.id, {
                                      allocatedAmount: Number(e.target.value) || 0,
                                    })
                                  }
                                  placeholder="0"
                                  className="w-full rounded-lg border border-primary/20 bg-surface pl-7 pr-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedCategoryId(category.id)
                                  setIsExpenseModalOpen(true)
                                }}
                                className="ml-auto inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
                              >
                                <PlusIcon className="h-3 w-3" />
                                Add Expense
                              </button>
                            </div>

                            {/* Expenses list */}
                            {categoryExpenses.length > 0 ? (
                              <div className="space-y-2">
                                {categoryExpenses.map((expense) => (
                                  <div
                                    key={expense.id}
                                    className="flex items-center justify-between rounded-lg border border-primary/10 bg-surface px-3 py-2"
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div
                                        className={clsx(
                                          'h-2 w-2 rounded-full shrink-0',
                                          expense.isPaid ? 'bg-green-500' : 'bg-amber-500'
                                        )}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text truncate">
                                          {expense.description}
                                        </p>
                                        <p className="text-xs text-text/50">
                                          {expense.vendorName && `${expense.vendorName} • `}
                                          {new Date(expense.date).toLocaleDateString()}
                                          {expense.isPaid ? ' • Paid' : ' • Pending'}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="text-sm font-semibold text-text">
                                        {formatCurrency(expense.amount)}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleEditExpense(expense)
                                        }}
                                        className="rounded-lg p-1.5 text-text/40 hover:bg-primary/10 hover:text-primary transition"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDeleteExpense(expense.id)
                                        }}
                                        className="rounded-lg p-1.5 text-text/40 hover:bg-red-500/10 hover:text-red-500 transition"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-center text-sm text-text/40 py-4">No expenses yet</p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Timeline View */}
            {activeView === 'timeline' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ExpenseTimeline
                  expenses={budgetExpenses}
                  categories={budgetCategories}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
              </motion.div>
            )}
          </div>
        )}
      </section>

      {/* Enhanced Expense Modal */}
      {isExpenseModalOpen && (
        <EnhancedExpenseModal
          categories={budgetCategories}
          selectedCategoryId={selectedCategoryId}
          expense={editingExpense}
          onClose={() => {
            setIsExpenseModalOpen(false)
            setSelectedCategoryId(null)
            setEditingExpense(null)
          }}
          onSave={editingExpense ? handleUpdateExpense : handleAddExpense}
        />
      )}
    </div>
  )
}

// Category Icon Helper
function CategoryIcon({ icon }: { icon?: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    building: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
      </svg>
    ),
    cake: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Z" />
      </svg>
    ),
    camera: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
      </svg>
    ),
    video: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    sparkles: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    flower: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    music: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
      </svg>
    ),
    envelope: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    car: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    gift: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
    dots: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
    ),
  }

  return <>{iconMap[icon || 'dots'] || iconMap.dots}</>
}


