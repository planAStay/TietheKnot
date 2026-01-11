'use client'

import { importGuestsFromCSV, importGuestsFromExcel, TImportResult } from '@/lib/guest-manager'
import { DialogTitle, DialogBody, DialogActions } from '@/components/dialog'
import { Button } from '@/components/button'
import { useState, useRef } from 'react'
import { XMarkIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline'

interface Props {
  onClose: () => void
  onImportSuccess: () => void
}

const DEFAULT_COLUMN_MAPPING: Record<string, string> = {
  name: 'name',
  email: 'email',
  phone: 'phone',
  side: 'side',
  priority: 'priority',
  relationship: 'relationship',
  guestCount: 'guestCount',
}

export default function GuestBulkImport({ onClose, onImportSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<'csv' | 'excel' | null>(null)
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>(DEFAULT_COLUMN_MAPPING)
  const [headers, setHeaders] = useState<string[]>([])
  const [importResult, setImportResult] = useState<TImportResult | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const fileName = selectedFile.name.toLowerCase()
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls')

    setFile(selectedFile)
    setFileType(isExcel ? 'excel' : 'csv')
    setImportResult(null)

    // Parse headers
    try {
      if (isExcel) {
        const XLSX = await import('xlsx')
        const arrayBuffer = await selectedFile.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as string[][]
        if (jsonData.length > 0) {
          setHeaders(jsonData[0].map((h) => String(h).trim()))
        }
      } else {
        const text = await selectedFile.text()
        const lines = text.split('\n').filter((line) => line.trim())
        if (lines.length > 0) {
          setHeaders(lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, '')))
        }
      }
    } catch (error) {
      console.error('Error parsing file:', error)
      alert('Failed to parse file. Please check the format.')
    }
  }

  const handleImport = async () => {
    if (!file || !fileType) return

    setIsImporting(true)
    setImportResult(null)

    try {
      let result: TImportResult

      if (fileType === 'csv') {
        const text = await file.text()
        result = importGuestsFromCSV(text, columnMapping)
      } else {
        result = await importGuestsFromExcel(file, columnMapping)
      }

      setImportResult(result)

      if (result.success || result.imported > 0) {
        onImportSuccess()
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (error) {
      console.error('Import error:', error)
      setImportResult({
        success: false,
        imported: 0,
        errors: [{ row: 0, message: error instanceof Error ? error.message : 'Unknown error' }],
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <DialogTitle>Bulk Import Guests</DialogTitle>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-text/60 hover:bg-primary/10 hover:text-primary transition"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <DialogBody>
        <div className="space-y-6">
          {/* Sample Format Example */}
          <div className="rounded-lg border border-primary/20 bg-surface/50 p-4">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-text mb-1">Expected File Format</h3>
              <p className="text-xs text-text/60">
                Your CSV/Excel file should include the following columns (headers can be named differently):
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-primary/10">
                    <th className="text-left py-2 px-3 font-medium text-text/80 bg-primary/5">Column Name</th>
                    <th className="text-left py-2 px-3 font-medium text-text/80 bg-primary/5">Required</th>
                    <th className="text-left py-2 px-3 font-medium text-text/80 bg-primary/5">Example Values</th>
                    <th className="text-left py-2 px-3 font-medium text-text/80 bg-primary/5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  <tr>
                    <td className="py-2 px-3 font-medium text-text">name</td>
                    <td className="py-2 px-3 text-text/70">
                      <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-red-600 dark:text-red-400 text-xs">Required</span>
                    </td>
                    <td className="py-2 px-3 text-text/70 font-mono">John Smith</td>
                    <td className="py-2 px-3 text-text/60">Guest or family name</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-text">email</td>
                    <td className="py-2 px-3 text-text/70">
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-600 dark:text-amber-400 text-xs">Optional</span>
                    </td>
                    <td className="py-2 px-3 text-text/70 font-mono">john@example.com</td>
                    <td className="py-2 px-3 text-text/60">Email address</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-text">phone</td>
                    <td className="py-2 px-3 text-text/70">
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-600 dark:text-amber-400 text-xs">Optional</span>
                    </td>
                    <td className="py-2 px-3 text-text/70 font-mono">+1 (555) 123-4567</td>
                    <td className="py-2 px-3 text-text/60">Phone number</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-text">side</td>
                    <td className="py-2 px-3 text-text/70">
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-600 dark:text-amber-400 text-xs">Optional</span>
                    </td>
                    <td className="py-2 px-3 text-text/70 font-mono">bride, groom, or mutual</td>
                    <td className="py-2 px-3 text-text/60">Default: bride</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-text">priority</td>
                    <td className="py-2 px-3 text-text/70">
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-600 dark:text-amber-400 text-xs">Optional</span>
                    </td>
                    <td className="py-2 px-3 text-text/70 font-mono">tier1 or tier2</td>
                    <td className="py-2 px-3 text-text/60">Default: tier1</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-text">relationship</td>
                    <td className="py-2 px-3 text-text/70">
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-600 dark:text-amber-400 text-xs">Optional</span>
                    </td>
                    <td className="py-2 px-3 text-text/70 font-mono">Extended Family; College Friends</td>
                    <td className="py-2 px-3 text-text/60">Separate multiple with semicolons</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-text">guestCount</td>
                    <td className="py-2 px-3 text-text/70">
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-600 dark:text-amber-400 text-xs">Optional</span>
                    </td>
                    <td className="py-2 px-3 text-text/70 font-mono">1, 2, 4</td>
                    <td className="py-2 px-3 text-text/60">Number of people (default: 1)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-xs font-medium text-text mb-1">Sample CSV Format:</p>
              <code className="text-xs text-text/70 font-mono block whitespace-pre-wrap">
{`name,email,phone,side,priority,relationship,guestCount
John Smith,john@example.com,+15551234567,bride,tier1,Extended Family,1
The Miller Family,miller@example.com,+15559876543,groom,tier1,Immediate Family,4
Sarah Johnson,,,mutual,tier2,College Friends,1`}
              </code>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Upload File</label>
            <div className="rounded-lg border-2 border-dashed border-primary/20 bg-surface/50 p-8 text-center">
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-primary/40" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-background transition hover:bg-primary/90">
                    Choose File
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <p className="mt-2 text-xs text-text/60">
                  Supports CSV and Excel (.xlsx, .xls) files
                </p>
              </div>
              {file && (
                <p className="mt-3 text-sm font-medium text-text">
                  Selected: {file.name} ({fileType?.toUpperCase()})
                </p>
              )}
            </div>
          </div>

          {/* Column Mapping */}
          {headers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Map Columns
                <span className="ml-2 text-xs font-normal text-text/60">
                  (Match your file columns to the required fields)
                </span>
              </label>
              <div className="space-y-3 rounded-lg border border-primary/20 bg-surface p-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-medium text-text/60 mb-3 pb-2 border-b border-primary/10">
                  <div>Field</div>
                  <div>Column from Your File</div>
                </div>
                {Object.entries(columnMapping).map(([field, currentColumn]) => {
                  const isRequired = field === 'name'
                  return (
                    <div key={field} className="grid grid-cols-2 gap-4 items-center">
                      <label className="text-sm font-medium text-text capitalize flex items-center gap-2">
                        {field}
                        {isRequired && (
                          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                            Required
                          </span>
                        )}
                        {!isRequired && (
                          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                            Optional
                          </span>
                        )}
                      </label>
                      <select
                        value={currentColumn}
                        onChange={(e) =>
                          setColumnMapping((prev) => ({ ...prev, [field]: e.target.value }))
                        }
                        className="rounded-lg border border-primary/20 bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
                        required={isRequired}
                      >
                        <option value="">-- Select Column --</option>
                        {headers.map((header) => (
                          <option key={header} value={header}>
                            {header}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Import Results */}
          {importResult && (
            <div
              className={`rounded-lg border p-4 ${
                importResult.success
                  ? 'border-green-500/20 bg-green-500/10'
                  : 'border-red-500/20 bg-red-500/10'
              }`}
            >
              <div className="font-medium text-text mb-2">
                {importResult.success ? 'Import Successful!' : 'Import Completed with Errors'}
              </div>
              <div className="text-sm text-text/70">
                Imported: {importResult.imported} guests
                {importResult.errors.length > 0 && ` (${importResult.errors.length} errors)`}
              </div>
              {importResult.errors.length > 0 && (
                <div className="mt-3 max-h-32 overflow-y-auto space-y-1">
                  {importResult.errors.slice(0, 10).map((error, idx) => (
                    <div key={idx} className="text-xs text-red-600 dark:text-red-400">
                      Row {error.row}: {error.message}
                    </div>
                  ))}
                  {importResult.errors.length > 10 && (
                    <div className="text-xs text-text/60">
                      ...and {importResult.errors.length - 10} more errors
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogBody>

      <DialogActions>
        <Button type="button" plain onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          color="dark/zinc"
          onClick={handleImport}
          disabled={!file || isImporting || headers.length === 0}
        >
          {isImporting ? 'Importing...' : 'Import Guests'}
        </Button>
      </DialogActions>
    </div>
  )
}

