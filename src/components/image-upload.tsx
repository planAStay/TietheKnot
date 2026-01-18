'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import { XMarkIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Button } from './button'
import {
  uploadImageToS3,
  deleteFromS3,
  formatFileSize,
  validateImageFile,
  type UploadProgress,
} from '@/lib/s3-upload'

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  label?: string
  helperText?: string
  className?: string
}

interface UploadingImage {
  id: string
  file: File
  preview: string
  progress: number
  error?: string
}

export default function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  label = 'Images',
  helperText = `Upload up to ${maxImages} images. JPEG, PNG, or WebP. Max 25MB each (will be compressed to 5MB if larger).`,
  className = '',
}: ImageUploadProps) {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const currentTotal = value.length + uploadingImages.length
    const availableSlots = maxImages - currentTotal

    if (availableSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    const filesToUpload = Array.from(files).slice(0, availableSlots)

    filesToUpload.forEach((file) => {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        alert(validation.error)
        return
      }

      const uploadingImage: UploadingImage = {
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
      }

      setUploadingImages((prev) => [...prev, uploadingImage])

      // Start upload
      uploadImageToS3(file, (progress: UploadProgress) => {
        setUploadingImages((prev) =>
          prev.map((img) =>
            img.id === uploadingImage.id ? { ...img, progress: progress.percentage } : img
          )
        )
      })
        .then((imageUrl: string) => {
          // Upload successful - add URL to the list
          onChange([...value, imageUrl])
          
          // Remove from uploading list
          setUploadingImages((prev) => prev.filter((img) => img.id !== uploadingImage.id))
          
          // Clean up preview URL
          URL.revokeObjectURL(uploadingImage.preview)
        })
        .catch((error) => {
          console.error('Upload failed:', error)
          setUploadingImages((prev) =>
            prev.map((img) =>
              img.id === uploadingImage.id
                ? { ...img, error: error.message || 'Upload failed' }
                : img
            )
          )
        })
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

  const handleRemoveImage = async (url: string, index: number) => {
    try {
      await deleteFromS3(url)
      const newUrls = value.filter((_, i) => i !== index)
      onChange(newUrls)
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Failed to delete image')
    }
  }

  const handleRemoveUploading = (id: string, preview: string) => {
    URL.revokeObjectURL(preview)
    setUploadingImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const canUploadMore = value.length + uploadingImages.length < maxImages

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
            <p className="text-xs text-secondary">{helperText}</p>
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

      {/* Uploaded and Uploading Images Grid */}
      {(value.length > 0 || uploadingImages.length > 0) && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* Uploaded Images */}
          {value.map((url, index) => (
            <div key={url} className="relative group aspect-square rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={`Uploaded ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(url, index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Remove image"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Uploading Images */}
          {uploadingImages.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-zinc-100"
            >
              <Image
                src={image.preview}
                alt="Uploading"
                fill
                className="object-cover opacity-50"
                sizes="(max-width: 640px) 50vw, 33vw"
              />

              {/* Progress or Error */}
              {image.error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/90 p-2">
                  <p className="text-xs text-red-600 text-center mb-2">{image.error}</p>
                  <button
                    type="button"
                    onClick={() => handleRemoveUploading(image.id, image.preview)}
                    className="text-xs text-red-600 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90">
                  <ArrowUpTrayIcon className="h-6 w-6 text-accent mb-2" />
                  <div className="w-3/4 bg-zinc-200 rounded-full h-2 mb-1">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${image.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-secondary">{image.progress}%</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Counter */}
      <p className="mt-2 text-xs text-secondary">
        {value.length} of {maxImages} images uploaded
        {uploadingImages.length > 0 && ` (${uploadingImages.length} uploading)`}
      </p>
    </div>
  )
}

