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

// Budget trends over time
export function getBudgetTrends(): Array<{ date: string; spent: number; count: number }> {
  const expenses = getBudgetExpenses()
  const trends = new Map<string, { spent: number; count: number }>()
  
  expenses.forEach((exp) => {
    const dateKey = new Date(exp.date).toISOString().split('T')[0]
    const existing = trends.get(dateKey) || { spent: 0, count: 0 }
    trends.set(dateKey, {
      spent: existing.spent + exp.amount,
      count: existing.count + 1,
    })
  })
  
  return Array.from(trends.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Category distribution for pie charts
export function getCategoryDistribution(
  categories: TBudgetCategory[]
): Array<{ name: string; value: number; percent: number; color?: string }> {
  const total = categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0)
  if (total === 0) return []
  
  return categories
    .filter((cat) => cat.allocatedAmount > 0)
    .map((cat) => ({
      name: cat.name,
      value: cat.allocatedAmount,
      percent: (cat.allocatedAmount / total) * 100,
    }))
}

// Budget alerts
export type TBudgetAlert = {
  categoryId: string
  categoryName: string
  severity: 'warning' | 'critical' | 'over-budget'
  message: string
  percentUsed: number
  allocated: number
  spent: number
  remaining: number
}

export function getBudgetAlerts(
  categories: TBudgetCategory[]
): TBudgetAlert[] {
  const alerts: TBudgetAlert[] = []
  
  categories.forEach((cat) => {
    if (cat.allocatedAmount === 0) return
    
    const percentUsed = (cat.spentAmount / cat.allocatedAmount) * 100
    const remaining = cat.allocatedAmount - cat.spentAmount
    
    let severity: TBudgetAlert['severity'] | null = null
    let message = ''
    
    if (percentUsed > 100) {
      severity = 'over-budget'
      message = `Over budget by ${formatCurrency(Math.abs(remaining))}`
    } else if (percentUsed >= 100) {
      severity = 'critical'
      message = 'Budget fully used'
    } else if (percentUsed >= 80) {
      severity = 'warning'
      message = `Approaching budget limit (${remaining > 0 ? formatCurrency(remaining) : '0'} remaining)`
    }
    
    if (severity) {
      alerts.push({
        categoryId: cat.id,
        categoryName: cat.name,
        severity,
        message,
        percentUsed,
        allocated: cat.allocatedAmount,
        spent: cat.spentAmount,
        remaining,
      })
    }
  })
  
  return alerts.sort((a, b) => {
    const order = { 'over-budget': 0, critical: 1, warning: 2 }
    return order[a.severity] - order[b.severity]
  })
}

// Export to CSV
export function exportBudgetToCSV(
  categories: TBudgetCategory[],
  expenses: TBudgetExpense[],
  totalBudget: number,
  weddingInfo?: { partnerOne?: string; partnerTwo?: string; weddingDate?: string }
): string {
  const summary = getBudgetSummary(categories, totalBudget)
  const lines: string[] = []
  
  // Header
  lines.push('Wedding Budget Report')
  if (weddingInfo?.partnerOne || weddingInfo?.partnerTwo) {
    const names = [weddingInfo.partnerOne, weddingInfo.partnerTwo].filter(Boolean).join(' & ')
    lines.push(`Couple: ${names}`)
  }
  if (weddingInfo?.weddingDate) {
    lines.push(`Wedding Date: ${new Date(weddingInfo.weddingDate).toLocaleDateString()}`)
  }
  lines.push(`Report Generated: ${new Date().toLocaleDateString()}`)
  lines.push('')
  
  // Summary
  lines.push('SUMMARY')
  lines.push(`Total Budget,${formatCurrency(totalBudget)}`)
  lines.push(`Total Allocated,${formatCurrency(summary.totalAllocated)}`)
  lines.push(`Total Spent,${formatCurrency(summary.totalSpent)}`)
  lines.push(`Remaining,${formatCurrency(summary.remaining)}`)
  lines.push(`Unallocated,${formatCurrency(summary.unallocated)}`)
  lines.push(`Percent Spent,${summary.percentSpent.toFixed(1)}%`)
  lines.push('')
  
  // Categories
  lines.push('CATEGORIES')
  lines.push('Category,Allocated,Spent,Remaining,Percent Used')
  categories.forEach((cat) => {
    const percent = cat.allocatedAmount > 0 
      ? ((cat.spentAmount / cat.allocatedAmount) * 100).toFixed(1)
      : '0'
    const remaining = cat.allocatedAmount - cat.spentAmount
    lines.push(
      `${cat.name},${formatCurrency(cat.allocatedAmount)},${formatCurrency(cat.spentAmount)},${formatCurrency(remaining)},${percent}%`
    )
  })
  lines.push('')
  
  // Expenses
  lines.push('EXPENSES')
  lines.push('Date,Category,Description,Vendor,Amount,Status')
  expenses
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((exp) => {
      const category = categories.find((c) => c.id === exp.categoryId)
      const date = new Date(exp.date).toLocaleDateString()
      lines.push(
        `${date},${category?.name || 'Unknown'},${exp.description},${exp.vendorName || ''},${formatCurrency(exp.amount)},${exp.isPaid ? 'Paid' : 'Pending'}`
      )
    })
  
  return lines.join('\n')
}

// Export to PDF
export async function exportBudgetToPDF(
  categories: TBudgetCategory[],
  expenses: TBudgetExpense[],
  totalBudget: number,
  weddingInfo?: { partnerOne?: string; partnerTwo?: string; weddingDate?: string }
): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const autoTable = (await import('jspdf-autotable')).default
  
  const doc = new jsPDF()
  const summary = getBudgetSummary(categories, totalBudget)
  
  // Title
  doc.setFontSize(20)
  doc.text('Wedding Budget Report', 14, 20)
  
  // Info
  let yPos = 30
  doc.setFontSize(11)
  if (weddingInfo?.partnerOne || weddingInfo?.partnerTwo) {
    const names = [weddingInfo.partnerOne, weddingInfo.partnerTwo].filter(Boolean).join(' & ')
    doc.text(`Couple: ${names}`, 14, yPos)
    yPos += 7
  }
  if (weddingInfo?.weddingDate) {
    doc.text(`Wedding Date: ${new Date(weddingInfo.weddingDate).toLocaleDateString()}`, 14, yPos)
    yPos += 7
  }
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, yPos)
  yPos += 10
  
  // Summary
  doc.setFontSize(14)
  doc.text('Summary', 14, yPos)
  yPos += 7
  doc.setFontSize(10)
  
  const summaryData = [
    ['Total Budget', formatCurrency(totalBudget)],
    ['Total Allocated', formatCurrency(summary.totalAllocated)],
    ['Total Spent', formatCurrency(summary.totalSpent)],
    ['Remaining', formatCurrency(summary.remaining)],
    ['Unallocated', formatCurrency(summary.unallocated)],
    ['Percent Spent', `${summary.percentSpent.toFixed(1)}%`],
  ]
  
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Amount']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [220, 53, 69] },
  })
  
  let finalY = (doc as any).lastAutoTable.finalY || yPos + 30
  
  // Categories
  finalY += 10
  doc.setFontSize(14)
  doc.text('Categories', 14, finalY)
  finalY += 7
  
  const categoryData = categories.map((cat) => {
    const percent = cat.allocatedAmount > 0 
      ? ((cat.spentAmount / cat.allocatedAmount) * 100).toFixed(1)
      : '0'
    const remaining = cat.allocatedAmount - cat.spentAmount
    return [
      cat.name,
      formatCurrency(cat.allocatedAmount),
      formatCurrency(cat.spentAmount),
      formatCurrency(remaining),
      `${percent}%`,
    ]
  })
  
  autoTable(doc, {
    startY: finalY,
    head: [['Category', 'Allocated', 'Spent', 'Remaining', 'Percent Used']],
    body: categoryData,
    theme: 'striped',
    headStyles: { fillColor: [220, 53, 69] },
  })
  
  finalY = (doc as any).lastAutoTable.finalY || finalY + 30
  
  // Expenses (if any)
  if (expenses.length > 0) {
    finalY += 10
    if (finalY > 250) {
      doc.addPage()
      finalY = 20
    }
    
    doc.setFontSize(14)
    doc.text('Expenses', 14, finalY)
    finalY += 7
    
    const expenseData = expenses
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((exp) => {
        const category = categories.find((c) => c.id === exp.categoryId)
        return [
          new Date(exp.date).toLocaleDateString(),
          category?.name || 'Unknown',
          exp.description,
          exp.vendorName || '',
          formatCurrency(exp.amount),
          exp.isPaid ? 'Paid' : 'Pending',
        ]
      })
    
    autoTable(doc, {
      startY: finalY,
      head: [['Date', 'Category', 'Description', 'Vendor', 'Amount', 'Status']],
      body: expenseData,
      theme: 'striped',
      headStyles: { fillColor: [220, 53, 69] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 50 },
        3: { cellWidth: 35 },
        4: { cellWidth: 25 },
        5: { cellWidth: 20 },
      },
    })
  }
  
  // Save
  const filename = `wedding-budget-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}

