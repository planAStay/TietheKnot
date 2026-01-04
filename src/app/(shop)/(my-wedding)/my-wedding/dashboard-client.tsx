'use client'

import VendorCard from '@/components/vendor-card'
import { getVendorCategories, getAllVendors } from '@/data-wedding'
import { useWedding } from '@/lib/wedding-context'
import { getBudgetSummary, formatCurrency } from '@/lib/budget-manager'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { 
  CalendarDaysIcon, 
  HeartIcon, 
  DocumentTextIcon, 
  SparklesIcon, 
  ArrowRightIcon, 
  MapPinIcon, 
  UserGroupIcon,
  BanknotesIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function DashboardClient() {
  const categories = getVendorCategories().slice(0, 6)
  const featured = getAllVendors().filter((v) => v.featured).slice(0, 4)
  const { 
    favorites, 
    favoriteVendors, 
    quotations, 
    weddingInfo, 
    setWeddingInfo,
    budgetCategories,
    budgetExpenses,
    updateBudgetCategory,
    addBudgetExpense,
    deleteBudgetExpense,
  } = useWedding()

  const coupleNames = [weddingInfo.partnerOne, weddingInfo.partnerTwo].filter(Boolean).join(' & ')
  
  // Budget state
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  
  const totalBudget = weddingInfo.totalBudget || 0
  const budgetSummary = getBudgetSummary(budgetCategories, totalBudget)

  type CountdownState = {
    days: number
    hours: number
    minutes: number
    seconds: number
    isPast: boolean
  } | null

  const computeCountdown = (dateStr?: string | null): CountdownState => {
    if (!dateStr) return null
    const target = new Date(dateStr)
    const now = new Date()
    const diffMs = target.getTime() - now.getTime()
    if (diffMs < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
    }
    const totalSeconds = Math.floor(diffMs / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return { days, hours, minutes, seconds, isPast: false }
  }

  const [countdown, setCountdown] = useState<CountdownState>(() => computeCountdown(weddingInfo.weddingDate))
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setCountdown(computeCountdown(weddingInfo.weddingDate))
    if (!weddingInfo.weddingDate) return
    const id = setInterval(() => {
      setCountdown(computeCountdown(weddingInfo.weddingDate))
    }, 1000)
    return () => clearInterval(id)
  }, [weddingInfo.weddingDate])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Dashboard Section */}
      <section className="container pt-24 pb-8 lg:pt-28">
        {/* Top Info Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm">
          {countdown ? (
            <Link 
              href="#" 
              className="inline-flex items-center gap-2 text-text/70 hover:text-primary transition"
            >
              <CalendarDaysIcon className="h-4 w-4" />
              <span className="underline underline-offset-2">
                {countdown.isPast 
                  ? 'Congratulations!' 
                  : countdown.days === 0 
                    ? "Today's the day!" 
                    : `${countdown.days} days to go!`}
              </span>
            </Link>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 text-text/70 hover:text-primary transition"
            >
              <CalendarDaysIcon className="h-4 w-4" />
              <span className="underline underline-offset-2">Set wedding date</span>
            </button>
          )}
          <span className="text-text/30">•</span>
          <button className="inline-flex items-center gap-2 text-text/70 hover:text-primary transition">
            <MapPinIcon className="h-4 w-4" />
            <span className="underline underline-offset-2">Add city</span>
          </button>
        </div>

        {/* Couple Names - Large & Centered */}
        <div className="text-center mb-10">
          {coupleNames ? (
            <h1 
              className="text-5xl font-bold text-text sm:text-6xl lg:text-7xl tracking-tight cursor-pointer hover:text-text/80 transition"
              onClick={() => setIsEditing(true)}
            >
              {coupleNames}
            </h1>
          ) : (
            <h1 
              className="text-5xl font-bold text-text/40 sm:text-6xl lg:text-7xl tracking-tight cursor-pointer hover:text-text/60 transition"
              onClick={() => setIsEditing(true)}
            >
              Your Names Here
            </h1>
          )}
        </div>

        {/* Edit Modal/Inline Form */}
        {isEditing && (
          <div className="mx-auto max-w-md mb-10 rounded-2xl border border-primary/20 bg-surface p-6 shadow-lg">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">Partner One</label>
                  <input
                    type="text"
                    value={weddingInfo.partnerOne || ''}
                    onChange={(e) => setWeddingInfo({ ...weddingInfo, partnerOne: e.target.value })}
                    placeholder="First name"
                    className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">Partner Two</label>
                  <input
                    type="text"
                    value={weddingInfo.partnerTwo || ''}
                    onChange={(e) => setWeddingInfo({ ...weddingInfo, partnerTwo: e.target.value })}
                    placeholder="First name"
                    className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">Wedding Date</label>
                <input
                  type="date"
                  value={weddingInfo.weddingDate || ''}
                  onChange={(e) => setWeddingInfo({ ...weddingInfo, weddingDate: e.target.value })}
                  className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">Total Budget</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text/50">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={weddingInfo.totalBudget || ''}
                    onChange={(e) => setWeddingInfo({ ...weddingInfo, totalBudget: Number(e.target.value) || 0 })}
                    placeholder="e.g. 30000"
                    className="w-full rounded-xl border border-primary/20 bg-background pl-8 pr-4 py-3 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-background transition hover:bg-primary/90"
              >
                Save Details
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats Row */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickStatCard
            icon={<BanknotesIcon className="h-5 w-5 text-primary" />}
            value={totalBudget > 0 ? formatCurrency(totalBudget) : '--'}
            label="total budget"
            href="#budget"
          />
          <QuickStatCard
            icon={<SparklesIcon className="h-5 w-5 text-green-500" />}
            value={totalBudget > 0 ? formatCurrency(budgetSummary.remaining) : '--'}
            label="remaining"
            href="#budget"
          />
          <QuickStatCard
            icon={<HeartIcon className="h-5 w-5 text-accent" />}
            value={favoriteVendors.length.toString()}
            label="saved vendors"
            href="/favorites"
          />
          <QuickStatCard
            icon={<DocumentTextIcon className="h-5 w-5 text-secondary" />}
            value={quotations.length.toString()}
            label="quotations"
            href="/quotations"
          />
        </div>
      </section>

      {/* Budget Planning Section */}
      <section id="budget" className="container py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text">Budget Planner</h2>
            <p className="mt-1 text-sm text-text/60">Track your wedding expenses and stay on budget</p>
          </div>
          {totalBudget === 0 && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-background transition hover:bg-primary/90"
            >
              <PlusIcon className="h-4 w-4" />
              Set Your Budget
            </button>
          )}
        </div>

        {totalBudget > 0 ? (
          <div className="space-y-6">
            {/* Budget Overview Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <BudgetOverviewCard
                title="Total Budget"
                amount={totalBudget}
                icon={<BanknotesIcon className="h-6 w-6" />}
                color="primary"
              />
              <BudgetOverviewCard
                title="Total Spent"
                amount={budgetSummary.totalSpent}
                subtitle={`${budgetSummary.percentSpent.toFixed(1)}% of budget`}
                icon={<DocumentTextIcon className="h-6 w-6" />}
                color="secondary"
              />
              <BudgetOverviewCard
                title="Remaining"
                amount={budgetSummary.remaining}
                icon={<CheckCircleIcon className="h-6 w-6" />}
                color={budgetSummary.remaining >= 0 ? 'green' : 'red'}
              />
              <BudgetOverviewCard
                title="Unallocated"
                amount={budgetSummary.unallocated}
                subtitle="Not assigned to categories"
                icon={<SparklesIcon className="h-6 w-6" />}
                color="accent"
              />
            </div>

            {/* Budget Progress Bar */}
            <div className="rounded-2xl border border-primary/10 bg-surface p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-text">Overall Progress</span>
                <span className="text-sm text-text/60">
                  {formatCurrency(budgetSummary.totalSpent)} of {formatCurrency(totalBudget)}
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-background">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-500',
                    budgetSummary.percentSpent > 100 ? 'bg-red-500' : 
                    budgetSummary.percentSpent > 80 ? 'bg-amber-500' : 'bg-primary'
                  )}
                  style={{ width: `${Math.min(budgetSummary.percentSpent, 100)}%` }}
                />
              </div>
              {budgetSummary.percentSpent > 100 && (
                <p className="mt-2 text-sm text-red-500">
                  ⚠️ You&apos;re over budget by {formatCurrency(budgetSummary.totalSpent - totalBudget)}
                </p>
              )}
            </div>

            {/* Budget Categories */}
            <div className="rounded-2xl border border-primary/10 bg-surface overflow-hidden">
              <div className="border-b border-primary/10 p-4">
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
                  const percentUsed = category.allocatedAmount > 0 
                    ? (category.spentAmount / category.allocatedAmount) * 100 
                    : 0
                  
                  return (
                    <div key={category.id} className="group">
                      <div 
                        className="flex cursor-pointer items-center gap-4 p-4 transition hover:bg-primary/5"
                        onClick={() => {
                          const next = new Set(expandedCategories)
                          if (isExpanded) {
                            next.delete(category.id)
                          } else {
                            next.add(category.id)
                          }
                          setExpandedCategories(next)
                        }}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <CategoryBudgetIcon icon={category.icon} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-text">{category.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-text/60">
                                {formatCurrency(category.spentAmount)}
                                <span className="text-text/40"> / </span>
                                {category.allocatedAmount > 0 ? formatCurrency(category.allocatedAmount) : '--'}
                              </span>
                              {isExpanded ? (
                                <ChevronUpIcon className="h-4 w-4 text-text/40" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4 text-text/40" />
                              )}
                            </div>
                          </div>
                          
                          <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                            <div
                              className={clsx(
                                'h-full rounded-full transition-all',
                                percentUsed > 100 ? 'bg-red-500' : 
                                percentUsed > 80 ? 'bg-amber-500' : 'bg-primary/60'
                              )}
                              style={{ width: `${Math.min(percentUsed, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="border-t border-primary/5 bg-background/50 px-4 py-3">
                          {/* Category allocation editor */}
                          <div className="mb-4 flex items-center gap-3">
                            <label className="text-xs text-text/50 shrink-0">Allocated:</label>
                            <div className="relative flex-1 max-w-[200px]">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50 text-sm">$</span>
                              <input
                                type="number"
                                min="0"
                                step="100"
                                value={category.allocatedAmount || ''}
                                onChange={(e) => updateBudgetCategory(category.id, { allocatedAmount: Number(e.target.value) || 0 })}
                                placeholder="0"
                                className="w-full rounded-lg border border-primary/20 bg-surface pl-7 pr-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
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
                                  <div className="flex items-center gap-3">
                                    <div className={clsx(
                                      'h-2 w-2 rounded-full',
                                      expense.isPaid ? 'bg-green-500' : 'bg-amber-500'
                                    )} />
                                    <div>
                                      <p className="text-sm font-medium text-text">{expense.description}</p>
                                      <p className="text-xs text-text/50">
                                        {expense.vendorName && `${expense.vendorName} • `}
                                        {new Date(expense.date).toLocaleDateString()}
                                        {expense.isPaid ? ' • Paid' : ' • Pending'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-text">{formatCurrency(expense.amount)}</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteBudgetExpense(expense.id)
                                      }}
                                      className="rounded-lg p-1.5 text-text/40 hover:bg-red-500/10 hover:text-red-500 transition"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-sm text-text/40 py-2">No expenses yet</p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-surface/50 p-12 text-center">
            <BanknotesIcon className="mx-auto h-12 w-12 text-primary/40" />
            <h3 className="mt-4 text-lg font-semibold text-text">Set Your Wedding Budget</h3>
            <p className="mt-2 text-sm text-text/60 max-w-md mx-auto">
              Start by setting your total budget. We&apos;ll help you allocate funds across different categories and track your expenses.
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background transition hover:bg-primary/90"
            >
              <PlusIcon className="h-4 w-4" />
              Get Started
            </button>
          </div>
        )}
      </section>

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <ExpenseModal
          categories={budgetCategories}
          selectedCategoryId={selectedCategoryId}
          onClose={() => {
            setIsExpenseModalOpen(false)
            setSelectedCategoryId(null)
          }}
          onSave={(expense) => {
            addBudgetExpense(expense)
            setIsExpenseModalOpen(false)
            setSelectedCategoryId(null)
          }}
        />
      )}

      {/* Jump Right In - Featured Vendors */}
      <section className="container py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-text">Jump right in</h2>
          <Link
            href="/collections/all"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80"
          >
            View all vendors
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text">Browse by category</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, idx) => (
            <Link
              key={category.id}
              href={`/collections/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-surface p-6 transition hover:border-primary/30 hover:shadow-lg"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-transparent transition group-hover:scale-125" />
              
              <div className="relative">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CategoryIcon index={idx} />
                </div>
                
                <h3 className="text-lg font-semibold text-text">{category.name}</h3>
                <p className="mt-1 text-sm text-text/60 line-clamp-2">{category.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.subcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub.id}
                      className="rounded-full bg-background px-3 py-1 text-xs text-text/70"
                    >
                      {sub.name}
                    </span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                      +{category.subcategories.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                  Browse vendors
                  <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/collections/all"
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-surface px-6 py-3 text-sm font-semibold text-text transition hover:bg-primary hover:text-background"
          >
            View All Categories
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function QuickStatCard({
  icon,
  value,
  label,
  href,
}: {
  icon: React.ReactNode
  value: string
  label: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-full border border-primary/10 bg-surface px-5 py-4 transition hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        {icon}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-text">{value}</span>
          <span className="text-sm text-text/60">{label}</span>
        </div>
      </div>
      <ArrowRightIcon className="h-4 w-4 text-text/30 transition group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  )
}

function CategoryIcon({ index }: { index: number }) {
  const icons = [
    <svg key="camera" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>,
    <svg key="building" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
    </svg>,
    <svg key="sparkles" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>,
    <svg key="shirt" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>,
    <svg key="flower" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>,
    <svg key="music" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
    </svg>,
  ]
  return icons[index % icons.length]
}

function BudgetOverviewCard({
  title,
  amount,
  subtitle,
  icon,
  color,
}: {
  title: string
  amount: number
  subtitle?: string
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'accent' | 'green' | 'red'
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    green: 'bg-green-500/10 text-green-500',
    red: 'bg-red-500/10 text-red-500',
  }
  
  return (
    <div className="rounded-2xl border border-primary/10 bg-surface p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text/60">{title}</span>
        <div className={clsx('flex h-8 w-8 items-center justify-center rounded-full', colorClasses[color])}>
          {icon}
        </div>
      </div>
      <p className={clsx('text-2xl font-bold', color === 'red' ? 'text-red-500' : 'text-text')}>
        {formatCurrency(amount)}
      </p>
      {subtitle && <p className="mt-1 text-xs text-text/50">{subtitle}</p>}
    </div>
  )
}

function CategoryBudgetIcon({ icon }: { icon?: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    building: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
      </svg>
    ),
    cake: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Z" />
      </svg>
    ),
    camera: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
      </svg>
    ),
    video: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    sparkles: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    flower: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    music: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
      </svg>
    ),
    envelope: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    car: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    gift: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
    dots: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
    ),
  }
  
  return iconMap[icon || 'dots'] || iconMap.dots
}

import { TBudgetCategory, TBudgetExpense } from '@/type'

function ExpenseModal({
  categories,
  selectedCategoryId,
  onClose,
  onSave,
}: {
  categories: TBudgetCategory[]
  selectedCategoryId: string | null
  onClose: () => void
  onSave: (expense: Omit<TBudgetExpense, 'id'>) => void
}) {
  const [categoryId, setCategoryId] = useState(selectedCategoryId || categories[0]?.id || '')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [vendorName, setVendorName] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

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
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">Add Expense</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text/40 hover:bg-primary/10 hover:text-text transition"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Venue deposit"
              required
              className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text/50">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full rounded-xl border border-primary/20 bg-background pl-8 pr-4 py-3 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">Vendor (optional)</label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="e.g. The Grand Ballroom"
              className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text/50">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPaid(!isPaid)}
              className={clsx(
                'flex h-5 w-5 items-center justify-center rounded border-2 transition',
                isPaid 
                  ? 'border-green-500 bg-green-500 text-white' 
                  : 'border-primary/30 bg-background'
              )}
            >
              {isPaid && <CheckCircleIcon className="h-3.5 w-3.5" />}
            </button>
            <span className="text-sm text-text">Mark as paid</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm font-semibold text-text transition hover:bg-primary/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-background transition hover:bg-primary/90"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

