'use client'

import { BanknotesIcon, DocumentTextIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { formatCurrency } from '@/lib/budget-manager'
import clsx from 'clsx'
import { motion } from 'framer-motion'

interface BudgetOverviewCardsProps {
  totalBudget: number
  totalSpent: number
  remaining: number
  unallocated: number
  percentSpent: number
}

export default function BudgetOverviewCards({
  totalBudget,
  totalSpent,
  remaining,
  unallocated,
  percentSpent,
}: BudgetOverviewCardsProps) {
  const cards = [
    {
      title: 'Total Budget',
      amount: totalBudget,
      subtitle: 'Your wedding budget',
      icon: <BanknotesIcon className="h-6 w-6" />,
      color: 'primary',
      gradient: 'from-primary/20 to-primary/5',
    },
    {
      title: 'Total Spent',
      amount: totalSpent,
      subtitle: `${percentSpent.toFixed(1)}% of budget`,
      icon: <DocumentTextIcon className="h-6 w-6" />,
      color: percentSpent > 100 ? 'red' : percentSpent > 80 ? 'amber' : 'secondary',
      gradient: percentSpent > 100 
        ? 'from-red-500/20 to-red-500/5' 
        : percentSpent > 80 
        ? 'from-amber-500/20 to-amber-500/5'
        : 'from-secondary/20 to-secondary/5',
    },
    {
      title: 'Remaining',
      amount: remaining,
      subtitle: remaining >= 0 ? 'On track' : 'Over budget',
      icon: <CheckCircleIcon className="h-6 w-6" />,
      color: remaining >= 0 ? 'green' : 'red',
      gradient: remaining >= 0 
        ? 'from-green-500/20 to-green-500/5' 
        : 'from-red-500/20 to-red-500/5',
    },
    {
      title: 'Unallocated',
      amount: unallocated,
      subtitle: 'Not assigned to categories',
      icon: <SparklesIcon className="h-6 w-6" />,
      color: 'accent',
      gradient: 'from-accent/20 to-accent/5',
    },
  ]

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    green: 'text-green-500',
    red: 'text-red-500',
    amber: 'text-amber-500',
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={clsx(
            'group relative overflow-hidden rounded-2xl border border-primary/10 bg-surface p-6 transition-all hover:shadow-lg hover:border-primary/20',
            `bg-gradient-to-br ${card.gradient}`
          )}
        >
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-text/60">{card.title}</span>
              <div className={clsx('rounded-full p-2', colorClasses[card.color as keyof typeof colorClasses])}>
                {card.icon}
              </div>
            </div>
            <p className={clsx(
              'text-3xl font-bold mb-1',
              (card.color === 'red') ? 'text-red-500' : 'text-text'
            )}>
              {formatCurrency(card.amount)}
            </p>
            {card.subtitle && (
              <p className="text-xs text-text/50">{card.subtitle}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

