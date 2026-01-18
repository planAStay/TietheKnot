import { API_ENDPOINTS, getAuthHeaders } from './api/config'

export interface PresignedUrlResponse {
  uploadUrl: string
  s3Key: string
  publicUrl: string
  expiresIn: number
}


export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

/**
 * Get presigned URL for image upload
 */
async function getPresignedUrlForImage(
  fileName: string,
  contentType: string
): Promise<PresignedUrlResponse> {
  const response = await fetch(API_ENDPOINTS.files.presignedUrlImage, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      fileName,
      contentType,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to get presigned URL: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get presigned URL for PDF upload
 */
async function getPresignedUrlForPdf(fileName: string): Promise<PresignedUrlResponse> {
  const response = await fetch(API_ENDPOINTS.files.presignedUrlPdf, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      fileName,
      contentType: 'application/pdf',
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to get presigned URL: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Upload file directly to S3 using presigned URL
 */
async function uploadToS3(
  uploadUrl: string,
  file: File,
  contentType: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100),
          })
        }
      })
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve()
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'))
    })

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'))
    })

    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', contentType)
    xhr.send(file)
  })
}

/**
 * Compress image to maximum size (5MB)
 * Only compresses if file size > maxSizeMB
 * Returns original file if already within limit
 */
export async function compressImageToMaxSize(
  file: File,
  maxSizeMB: number = 5
): Promise<File> {
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  // If file is already within limit, return as-is
  if (file.size <= maxSizeBytes) {
    return file
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const img = new Image()

    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error('Failed to read file'))
        return
      }

      img.onload = () => {
        // Calculate compression needed
        let quality = 0.9
        let width = img.width
        let height = img.height
        const maxDimension = 3840 // Max width/height to prevent huge images

        // If image dimensions are very large, resize first
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height)
          width = Math.floor(width * ratio)
          height = Math.floor(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height)

        // Try to compress iteratively until under max size
        const attemptCompress = (currentQuality: number): void => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'))
                return
              }

              // If file is small enough or quality is too low, return
              if (blob.size <= maxSizeBytes || currentQuality <= 0.5) {
                const compressedFile = new File(
                  [blob],
                  file.name,
                  { type: file.type || 'image/jpeg' }
                )
                resolve(compressedFile)
                return
              }

              // Try lower quality
              const newQuality = Math.max(0.5, currentQuality - 0.1)
              attemptCompress(newQuality)
            },
            file.type || 'image/jpeg',
            currentQuality
          )
        }

        // Start with high quality
        attemptCompress(quality)
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = e.target.result as string
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Upload an image to S3
 * Compresses image to 5MB if larger than 5MB before upload
 * Returns the public URL
 */
export async function uploadImageToS3(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    throw new Error('Image must be JPEG, PNG, or WebP format')
  }

  // Validate file size (25MB max before compression)
  const maxSizeBeforeCompression = 25 * 1024 * 1024 // 25MB
  if (file.size > maxSizeBeforeCompression) {
    throw new Error('Image size must be less than 25MB')
  }

  try {
    // Step 1: Compress image if > 5MB
    let fileToUpload = file
    if (file.size > 5 * 1024 * 1024) {
      // Show compression progress if callback provided
      onProgress?.({ loaded: 0, total: 100, percentage: 0 })
      fileToUpload = await compressImageToMaxSize(file, 5)
      console.log(`Compressed image from ${formatFileSize(file.size)} to ${formatFileSize(fileToUpload.size)}`)
    }

    // Step 2: Get presigned URL with compressed file's content type
    const presignedData = await getPresignedUrlForImage(fileToUpload.name, fileToUpload.type)

    // Step 3: Upload to S3
    await uploadToS3(presignedData.uploadUrl, fileToUpload, fileToUpload.type, onProgress)

    // Step 4: Return public URL
    return presignedData.publicUrl
  } catch (error) {
    console.error('Error uploading image to S3:', error)
    throw error
  }
}

/**
 * Upload a PDF to S3
 * Returns the public URL
 */
export async function uploadPdfToS3(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  // Validate file type
  if (file.type !== 'application/pdf') {
    throw new Error('File must be a PDF')
  }

  // Validate file size (20MB max)
  const maxSize = 20 * 1024 * 1024 // 20MB
  if (file.size > maxSize) {
    throw new Error('PDF size must be less than 20MB')
  }

  try {
    // Step 1: Get presigned URL
    const presignedData = await getPresignedUrlForPdf(file.name)

    // Step 2: Upload to S3
    await uploadToS3(presignedData.uploadUrl, file, file.type, onProgress)

    // Step 3: Return public URL
    return presignedData.publicUrl
  } catch (error) {
    console.error('Error uploading PDF to S3:', error)
    throw error
  }
}

/**
 * Delete a file from S3 by URL
 */
export async function deleteFromS3(url: string): Promise<void> {
  const response = await fetch(`${API_ENDPOINTS.files.delete}?url=${encodeURIComponent(url)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete file: ${response.statusText}`)
  }
}

/**
 * Delete a file from S3 by S3 key
 */
export async function deleteFromS3ByKey(s3Key: string): Promise<void> {
  const response = await fetch(
    `${API_ENDPOINTS.files.deleteByKey}?s3Key=${encodeURIComponent(s3Key)}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to delete file: ${response.statusText}`)
  }
}


/**
 * Helper function to format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Helper function to validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 25 * 1024 * 1024 // 25MB (will be compressed to 5MB if larger)

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Image must be JPEG, PNG, or WebP format',
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size must be less than 25MB',
    }
  }

  return { valid: true }
}

/**
 * Helper function to validate PDF file
 */
export function validatePdfFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 20 * 1024 * 1024 // 20MB

  if (file.type !== 'application/pdf') {
    return {
      valid: false,
      error: 'File must be a PDF',
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'PDF size must be less than 20MB',
    }
  }

  return { valid: true }
}

