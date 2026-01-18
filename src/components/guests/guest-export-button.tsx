'use client'

import { TGuest } from '@/type'
import { exportGuestsToCSV, exportGuestsToPDF } from '@/lib/guest-manager'
import { useState, useRef, useEffect } from 'react'
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface Props {
  guests: TGuest[]
}

export default function GuestExportButton({ guests }: Props) {
  const [isExporting, setIsExporting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [exportFilter, setExportFilter] = useState<'all' | 'attending'>('all')
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
      const filterAttendingOnly = exportFilter === 'attending'
      const csv = exportGuestsToCSV(filterAttendingOnly)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `wedding-guests-${filterAttendingOnly ? 'attending-' : ''}${new Date().toISOString().split('T')[0]}.csv`
      )
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
      const filterAttendingOnly = exportFilter === 'attending'
      await exportGuestsToPDF(filterAttendingOnly)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  if (guests.length === 0) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface px-4 py-2.5 text-sm font-semibold text-text transition hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        {isExporting ? 'Exporting...' : 'Export'}
        <ChevronDownIcon className={clsx('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-primary/20 bg-surface p-2 shadow-lg z-50">
          {/* Filter Selection */}
          <div className="mb-2 px-2 py-2 border-b border-primary/10">
            <label className="block text-xs font-medium text-text/60 mb-1.5">Export Filter</label>
            <select
              value={exportFilter}
              onChange={(e) => setExportFilter(e.target.value as 'all' | 'attending')}
              className="w-full rounded-lg border border-primary/20 bg-surface px-3 py-1.5 text-sm text-text focus:border-primary focus:outline-none"
            >
              <option value="all">All Guests</option>
              <option value="attending">Attending Only</option>
            </select>
          </div>

          {/* Export Options */}
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


