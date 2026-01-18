'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { validateImageFile } from '@/lib/s3-upload'

interface ImageFile {
  id: string
  file: File
  preview: string
}

interface ImageUploadDeferredProps {
  files: ImageFile[]
  onChange: (files: ImageFile[]) => void
  existingUrls?: string[]
  onRemoveExisting?: (url: string) => void
  maxImages?: number
  label?: string
  helperText?: string
  className?: string
}

export default function ImageUploadDeferred({
  files,
  onChange,
  existingUrls = [],
  onRemoveExisting,
  maxImages = 5,
  label = 'Images',
  helperText,
  className = '',
}: ImageUploadDeferredProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const defaultHelperText = `Upload up to ${maxImages} images. JPEG, PNG, or WebP. Max 25MB each (will be compressed to 5MB if larger).`
  const totalImages = files.length + existingUrls.length

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const availableSlots = maxImages - totalImages

    if (availableSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    const newFiles: ImageFile[] = []
    const filesToProcess = Array.from(fileList).slice(0, availableSlots)

    filesToProcess.forEach((file) => {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        alert(validation.error)
        return
      }

      const imageFile: ImageFile = {
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
      }

      newFiles.push(imageFile)
    })

    onChange([...files, ...newFiles])
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

  const handleRemoveFile = (id: string) => {
    const fileToRemove = files.find((f) => f.id === id)
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview)
      onChange(files.filter((f) => f.id !== id))
    }
  }

  const handleRemoveExisting = (url: string) => {
    if (onRemoveExisting) {
      onRemoveExisting(url)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const canUploadMore = totalImages < maxImages

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text mb-2">{label}</label>
      )}

      {/* Upload Area */}
      {canUploadMore && (
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
            <PhotoIcon className="h-12 w-12 text-zinc-400 mb-3" />
            <p className="text-sm text-text mb-1">
              Drag and drop images here, or{' '}
              <button
                type="button"
                onClick={handleBrowseClick}
                className="text-accent hover:text-accent/80 font-medium"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-secondary">{helperText || defaultHelperText}</p>
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ Images will be uploaded when you submit the form. Images larger than 5MB will be automatically compressed.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Images Grid */}
      {(existingUrls.length > 0 || files.length > 0) && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* Existing Uploaded Images */}
          {existingUrls.map((url, index) => (
            <div key={url} className="relative group aspect-square rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={`Existing ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                Saved
              </div>
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => handleRemoveExisting(url)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          {/* New Files (Not Yet Uploaded) */}
          {files.map((imageFile) => (
            <div
              key={imageFile.id}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-dashed border-blue-300"
            >
              <Image
                src={imageFile.preview}
                alt="Pending upload"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                Pending
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(imageFile.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Remove image"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      <p className="mt-2 text-xs text-secondary">
        {totalImages} of {maxImages} images
        {files.length > 0 && ` (${files.length} pending upload)`}
      </p>
    </div>
  )
}

// Export the ImageFile type for use in parent components
export type { ImageFile }

