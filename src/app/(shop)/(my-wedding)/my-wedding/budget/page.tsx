import { Metadata } from 'next'
import BudgetClient from './budget-client'

export const metadata: Metadata = {
  title: 'Budget Planner | My Wedding',
  description: 'Plan and track your wedding budget with detailed categories, expenses, and visual insights',
}

export default function BudgetPage() {
  return <BudgetClient />
}

