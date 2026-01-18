'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { formatFileSize, validatePdfFile } from '@/lib/s3-upload'

interface PdfUploadDeferredProps {
  file: File | null
  onChange: (file: File | null) => void
  existingUrl?: string | null
  onRemoveExisting?: () => void | Promise<void>
  label?: string
  helperText?: string
  className?: string
}

export default function PdfUploadDeferred({
  file,
  onChange,
  existingUrl,
  onRemoveExisting,
  label = 'Pricing PDF',
  helperText = 'Upload pricing document. PDF only. Max 20MB.',
  className = '',
}: PdfUploadDeferredProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const selectedFile = files[0]

    // Validate file
    const validation = validatePdfFile(selectedFile)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    onChange(selectedFile)
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = e.dataTransfer.files
    handleFileSelect(droppedFiles)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const handleRemoveFile = () => {
    onChange(null)
  }

  const handleRemoveExisting = () => {
    if (onRemoveExisting) {
      onRemoveExisting()
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const getFileName = (url: string) => {
    try {
      const urlParts = url.split('/')
      return decodeURIComponent(urlParts[urlParts.length - 1])
    } catch {
      return 'pricing.pdf'
    }
  }

  const hasContent = existingUrl || file

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text mb-2">{label}</label>
      )}

      {/* Upload Area (shown when no PDF) */}
      {!hasContent && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6
            transition-colors duration-200
            ${
              isDragging
                ? 'border-accent bg-accent/10'
                : 'border-zinc-300 hover:border-accent/50'
            }
          `}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <DocumentIcon className="h-12 w-12 text-zinc-400 mb-3" />
            <p className="text-sm text-text mb-1">
              Drag and drop PDF here, or{' '}
              <button
                type="button"
                onClick={handleBrowseClick}
                className="text-accent hover:text-accent/80 font-medium"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-secondary">{helperText}</p>
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ PDF will be uploaded when you submit the form
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Existing PDF */}
      {existingUrl && !file && (
        <div className="border-2 border-zinc-300 rounded-lg p-4 bg-zinc-50">
          <div className="flex items-start gap-3">
            <DocumentIcon className="h-8 w-8 text-accent flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-text truncate flex-1">
                  {getFileName(existingUrl)}
                </p>
                <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded whitespace-nowrap">
                  Saved
                </span>
              </div>
              <a
                href={existingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline"
              >
                View PDF
              </a>
            </div>
            {onRemoveExisting && (
              <button
                type="button"
                onClick={handleRemoveExisting}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                aria-label="Remove PDF"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pending PDF */}
      {file && (
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
          <div className="flex items-start gap-3">
            <DocumentIcon className="h-8 w-8 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-text truncate flex-1">{file.name}</p>
                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded whitespace-nowrap">
                  Pending
                </span>
              </div>
              <p className="text-xs text-secondary">{formatFileSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
              aria-label="Remove PDF"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Replace button when has content */}
      {hasContent && (
        <>
          <button
            type="button"
            onClick={handleBrowseClick}
            className="mt-2 text-sm text-accent hover:text-accent/80"
          >
            Replace PDF
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleInputChange}
            className="hidden"
          />
        </>
      )}
    </div>
  )
}

