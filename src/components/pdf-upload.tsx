'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { XMarkIcon, DocumentIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Button } from './button'
import {
  uploadPdfToS3,
  deleteFromS3,
  formatFileSize,
  validatePdfFile,
  type UploadProgress,
} from '@/lib/s3-upload'

interface PdfUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  label?: string
  helperText?: string
  className?: string
}

interface UploadingPdf {
  file: File
  progress: number
  error?: string
}

export default function PdfUpload({
  value,
  onChange,
  label = 'Pricing PDF',
  helperText = 'Upload pricing document. PDF only. Max 20MB.',
  className = '',
}: PdfUploadProps) {
  const [uploadingPdf, setUploadingPdf] = useState<UploadingPdf | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file
    const validation = validatePdfFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    const uploadingPdfData: UploadingPdf = {
      file,
      progress: 0,
    }

    setUploadingPdf(uploadingPdfData)

    // Start upload
    uploadPdfToS3(file, (progress: UploadProgress) => {
      setUploadingPdf((prev) => (prev ? { ...prev, progress: progress.percentage } : null))
    })
      .then((url: string) => {
        // Upload successful
        onChange(url)
        setUploadingPdf(null)
      })
      .catch((error) => {
        console.error('Upload failed:', error)
        setUploadingPdf((prev) =>
          prev ? { ...prev, error: error.message || 'Upload failed' } : null
        )
      })
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

    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const handleRemovePdf = async () => {
    if (!value) return

    try {
      await deleteFromS3(value)
      onChange(null)
    } catch (error) {
      console.error('Error deleting PDF:', error)
      alert('Failed to delete PDF')
    }
  }

  const handleRemoveUploading = () => {
    setUploadingPdf(null)
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

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text mb-2">{label}</label>
      )}

      {/* Upload Area (shown when no PDF uploaded and not currently uploading) */}
      {!value && !uploadingPdf && (
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

      {/* Uploading PDF */}
      {uploadingPdf && (
        <div className="border-2 border-zinc-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <DocumentIcon className="h-8 w-8 text-accent flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{uploadingPdf.file.name}</p>
              <p className="text-xs text-secondary">{formatFileSize(uploadingPdf.file.size)}</p>

              {uploadingPdf.error ? (
                <div className="mt-2">
                  <p className="text-xs text-red-600 mb-1">{uploadingPdf.error}</p>
                  <button
                    type="button"
                    onClick={handleRemoveUploading}
                    className="text-xs text-red-600 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="w-full bg-zinc-200 rounded-full h-2 mb-1">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadingPdf.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-secondary">Uploading... {uploadingPdf.progress}%</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Uploaded PDF */}
      {value && !uploadingPdf && (
        <div className="border-2 border-zinc-300 rounded-lg p-4 bg-zinc-50">
          <div className="flex items-start gap-3">
            <DocumentIcon className="h-8 w-8 text-accent flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{getFileName(value)}</p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline"
              >
                View PDF
              </a>
            </div>
            <button
              type="button"
              onClick={handleRemovePdf}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
              aria-label="Remove PDF"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Replace button when PDF is uploaded */}
      {value && !uploadingPdf && (
        <Button
          type="button"
          plain
          onClick={handleBrowseClick}
          className="mt-2 text-sm"
        >
          Replace PDF
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}

