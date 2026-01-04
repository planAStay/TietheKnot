import { TBudgetCategory, TBudgetExpense } from '@/type'
import { readStorage, writeStorage } from './local-storage'

const BUDGET_CATEGORIES_KEY = 'ttk_budget_categories'
const BUDGET_EXPENSES_KEY = 'ttk_budget_expenses'

// Default wedding budget categories
export const DEFAULT_BUDGET_CATEGORIES: Omit<TBudgetCategory, 'id'>[] = [
  { name: 'Venue', allocatedAmount: 0, spentAmount: 0, icon: 'building' },
  { name: 'Catering', allocatedAmount: 0, spentAmount: 0, icon: 'cake' },
  { name: 'Photography', allocatedAmount: 0, spentAmount: 0, icon: 'camera' },
  { name: 'Videography', allocatedAmount: 0, spentAmount: 0, icon: 'video' },
  { name: 'Attire & Accessories', allocatedAmount: 0, spentAmount: 0, icon: 'sparkles' },
  { name: 'Flowers & Decor', allocatedAmount: 0, spentAmount: 0, icon: 'flower' },
  { name: 'Music & Entertainment', allocatedAmount: 0, spentAmount: 0, icon: 'music' },
  { name: 'Invitations & Stationery', allocatedAmount: 0, spentAmount: 0, icon: 'envelope' },
  { name: 'Transportation', allocatedAmount: 0, spentAmount: 0, icon: 'car' },
  { name: 'Favors & Gifts', allocatedAmount: 0, spentAmount: 0, icon: 'gift' },
  { name: 'Hair & Makeup', allocatedAmount: 0, spentAmount: 0, icon: 'sparkles' },
  { name: 'Miscellaneous', allocatedAmount: 0, spentAmount: 0, icon: 'dots' },
]

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Category operations
export function getBudgetCategories(): TBudgetCategory[] {
  const stored = readStorage<TBudgetCategory[]>(BUDGET_CATEGORIES_KEY, [])
  if (stored.length === 0) {
    // Initialize with default categories
    const defaults = DEFAULT_BUDGET_CATEGORIES.map((cat) => ({
      ...cat,
      id: generateId(),
    }))
    writeStorage(BUDGET_CATEGORIES_KEY, defaults)
    return defaults
  }
  return stored
}

export function updateBudgetCategory(
  categoryId: string,
  updates: Partial<Omit<TBudgetCategory, 'id'>>
): TBudgetCategory[] {
  const categories = getBudgetCategories()
  const updated = categories.map((cat) =>
    cat.id === categoryId ? { ...cat, ...updates } : cat
  )
  writeStorage(BUDGET_CATEGORIES_KEY, updated)
  return updated
}

export function addBudgetCategory(
  category: Omit<TBudgetCategory, 'id'>
): TBudgetCategory[] {
  const categories = getBudgetCategories()
  const newCategory: TBudgetCategory = {
    ...category,
    id: generateId(),
  }
  const updated = [...categories, newCategory]
  writeStorage(BUDGET_CATEGORIES_KEY, updated)
  return updated
}

export function deleteBudgetCategory(categoryId: string): TBudgetCategory[] {
  const categories = getBudgetCategories()
  const updated = categories.filter((cat) => cat.id !== categoryId)
  writeStorage(BUDGET_CATEGORIES_KEY, updated)
  
  // Also delete associated expenses
  const expenses = getBudgetExpenses()
  const remainingExpenses = expenses.filter((exp) => exp.categoryId !== categoryId)
  writeStorage(BUDGET_EXPENSES_KEY, remainingExpenses)
  
  return updated
}

// Expense operations
export function getBudgetExpenses(): TBudgetExpense[] {
  return readStorage<TBudgetExpense[]>(BUDGET_EXPENSES_KEY, [])
}

export function addBudgetExpense(
  expense: Omit<TBudgetExpense, 'id'>
): TBudgetExpense[] {
  const expenses = getBudgetExpenses()
  const newExpense: TBudgetExpense = {
    ...expense,
    id: generateId(),
  }
  const updated = [...expenses, newExpense]
  writeStorage(BUDGET_EXPENSES_KEY, updated)
  
  // Update category spent amount
  recalculateCategorySpent(expense.categoryId)
  
  return updated
}

export function updateBudgetExpense(
  expenseId: string,
  updates: Partial<Omit<TBudgetExpense, 'id'>>
): TBudgetExpense[] {
  const expenses = getBudgetExpenses()
  const oldExpense = expenses.find((exp) => exp.id === expenseId)
  const updated = expenses.map((exp) =>
    exp.id === expenseId ? { ...exp, ...updates } : exp
  )
  writeStorage(BUDGET_EXPENSES_KEY, updated)
  
  // Recalculate category if it changed or if amount changed
  if (oldExpense) {
    recalculateCategorySpent(oldExpense.categoryId)
    if (updates.categoryId && updates.categoryId !== oldExpense.categoryId) {
      recalculateCategorySpent(updates.categoryId)
    }
  }
  
  return updated
}

export function deleteBudgetExpense(expenseId: string): TBudgetExpense[] {
  const expenses = getBudgetExpenses()
  const expense = expenses.find((exp) => exp.id === expenseId)
  const updated = expenses.filter((exp) => exp.id !== expenseId)
  writeStorage(BUDGET_EXPENSES_KEY, updated)
  
  if (expense) {
    recalculateCategorySpent(expense.categoryId)
  }
  
  return updated
}

function recalculateCategorySpent(categoryId: string): void {
  const expenses = getBudgetExpenses()
  const categories = getBudgetCategories()
  
  const totalSpent = expenses
    .filter((exp) => exp.categoryId === categoryId)
    .reduce((sum, exp) => sum + exp.amount, 0)
  
  const updated = categories.map((cat) =>
    cat.id === categoryId ? { ...cat, spentAmount: totalSpent } : cat
  )
  writeStorage(BUDGET_CATEGORIES_KEY, updated)
}

// Summary helpers
export function getBudgetSummary(
  categories: TBudgetCategory[],
  totalBudget: number
): {
  totalAllocated: number
  totalSpent: number
  remaining: number
  unallocated: number
  percentSpent: number
} {
  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spentAmount, 0)
  
  return {
    totalAllocated,
    totalSpent,
    remaining: totalBudget - totalSpent,
    unallocated: totalBudget - totalAllocated,
    percentSpent: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

