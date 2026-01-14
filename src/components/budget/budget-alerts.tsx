'use client'

import { TBudgetAlert } from '@/lib/budget-manager'
import { formatCurrency } from '@/lib/budget-manager'
import { ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useState } from 'react'

interface BudgetAlertsProps {
  alerts: TBudgetAlert[]
  onCategoryClick?: (categoryId: string) => void
}

export default function BudgetAlerts({ alerts, onCategoryClick }: BudgetAlertsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visibleAlerts = alerts.filter((alert) => !dismissed.has(alert.categoryId))

  if (visibleAlerts.length === 0) return null

  const getAlertConfig = (severity: TBudgetAlert['severity']) => {
    switch (severity) {
      case 'over-budget':
        return {
          icon: <XCircleIcon className="h-5 w-5" />,
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-500',
          title: 'Over Budget',
        }
      case 'critical':
        return {
          icon: <ExclamationTriangleIcon className="h-5 w-5" />,
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-500',
          title: 'Budget Limit Reached',
        }
      case 'warning':
        return {
          icon: <InformationCircleIcon className="h-5 w-5" />,
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          textColor: 'text-amber-500',
          title: 'Approaching Limit',
        }
    }
  }

  const handleDismiss = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDismissed((prev) => new Set([...prev, categoryId]))
  }

  return (
    <AnimatePresence>
      {visibleAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 space-y-3"
        >
          <h2 className="text-lg font-semibold text-text">Budget Alerts</h2>
          {visibleAlerts.map((alert, index) => {
            const config = getAlertConfig(alert.severity)
            return (
              <motion.div
                key={alert.categoryId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={clsx(
                  'group relative flex items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-md',
                  config.bgColor,
                  config.borderColor
                )}
              >
                <div className={clsx('mt-0.5 shrink-0', config.textColor)}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className={clsx('font-semibold mb-1', config.textColor)}>
                        {config.title}: {alert.categoryName}
                      </h3>
                      <p className="text-sm text-text/70 mb-2">{alert.message}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-text/60">
                        <span>
                          Allocated: <span className="font-medium">{formatCurrency(alert.allocated)}</span>
                        </span>
                        <span>
                          Spent: <span className="font-medium">{formatCurrency(alert.spent)}</span>
                        </span>
                        <span>
                          {alert.remaining >= 0 ? 'Remaining' : 'Over by'}:{' '}
                          <span className="font-medium">{formatCurrency(Math.abs(alert.remaining))}</span>
                        </span>
                        <span>
                          {alert.percentUsed.toFixed(1)}% used
                        </span>
                      </div>
                      {onCategoryClick && (
                        <button
                          onClick={() => onCategoryClick(alert.categoryId)}
                          className="mt-3 text-xs font-medium text-primary hover:underline"
                        >
                          View Category Details →
                        </button>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDismiss(alert.categoryId, e)}
                      className="shrink-0 rounded-lg p-1 text-text/40 hover:bg-primary/10 hover:text-text transition"
                      aria-label="Dismiss alert"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

