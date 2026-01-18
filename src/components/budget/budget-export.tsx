'use client'

import { TBudgetCategory, TBudgetExpense, TWeddingInfo } from '@/type'
import { exportBudgetToCSV, exportBudgetToPDF } from '@/lib/budget-manager'
import { ArrowDownTrayIcon, DocumentArrowDownIcon, DocumentTextIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'

interface BudgetExportProps {
  categories: TBudgetCategory[]
  expenses: TBudgetExpense[]
  totalBudget: number
  weddingInfo: TWeddingInfo
}

export default function BudgetExport({
  categories,
  expenses,
  totalBudget,
  weddingInfo,
}: BudgetExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleExportCSV = async () => {
    setIsExporting(true)
    setIsOpen(false)
    try {
      const csv = exportBudgetToCSV(categories, expenses, totalBudget, weddingInfo)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `wedding-budget-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Failed to export CSV. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    setIsOpen(false)
    try {
      await exportBudgetToPDF(categories, expenses, totalBudget, weddingInfo)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        {isExporting ? 'Exporting...' : 'Export Budget'}
        <ChevronDownIcon className={clsx('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-primary/20 bg-surface p-2 shadow-lg z-50">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text transition hover:bg-primary/10 disabled:opacity-50"
          >
            <DocumentTextIcon className="h-4 w-4 text-primary shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-medium">Export as CSV</div>
              <div className="text-xs text-text/50">Spreadsheet format</div>
            </div>
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text transition hover:bg-primary/10 disabled:opacity-50 mt-1"
          >
            <DocumentArrowDownIcon className="h-4 w-4 text-primary shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-medium">Export as PDF</div>
              <div className="text-xs text-text/50">Printable report</div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

