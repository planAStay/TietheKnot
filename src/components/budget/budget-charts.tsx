'use client'

import { TBudgetCategory } from '@/type'
import { getCategoryDistribution, formatCurrency } from '@/lib/budget-manager'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface BudgetChartsProps {
  categories: TBudgetCategory[]
  totalBudget: number
}

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
]

export default function BudgetCharts({ categories, totalBudget }: BudgetChartsProps) {
  const distribution = getCategoryDistribution(categories)
  
  // Prepare data for bar chart (Budget vs Actual)
  const barChartData = categories
    .filter((cat) => cat.allocatedAmount > 0 || cat.spentAmount > 0)
    .map((cat) => ({
      name: cat.name.length > 12 ? cat.name.substring(0, 12) + '...' : cat.name,
      fullName: cat.name,
      allocated: cat.allocatedAmount,
      spent: cat.spentAmount,
      remaining: Math.max(0, cat.allocatedAmount - cat.spentAmount),
    }))

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-primary/20 bg-surface p-3 shadow-lg">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
              {entry.payload.percent && ` (${entry.payload.percent.toFixed(1)}%)`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium fill-text"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pie Chart - Category Distribution */}
      {distribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-primary/10 bg-surface p-6"
        >
          <h3 className="mb-6 text-lg font-semibold text-text">Category Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value, entry: any) => (
                  <span className="text-text/70 text-sm">{value}</span>
                )}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Bar Chart - Budget vs Actual */}
      {barChartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-primary/10 bg-surface p-6"
        >
          <h3 className="mb-6 text-lg font-semibold text-text">Budget vs Actual Spending</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: 'currentColor', className: 'text-text/60 text-xs' }}
              />
              <YAxis
                tick={{ fill: 'currentColor', className: 'text-text/60 text-xs' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-text/70 text-sm">{value}</span>
                )}
              />
              <Bar
                dataKey="allocated"
                fill="hsl(var(--primary))"
                name="Allocated Budget"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="spent"
                fill="hsl(var(--secondary))"
                name="Actual Spent"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  )
}

