'use client'

import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Textarea } from '@/components/textarea'
import { Text, TextLink } from '@/components/text'
import { useAuth } from '@/lib/auth-context'
import ImageUploadDeferred, { type ImageFile } from '@/components/image-upload-deferred'
import PdfUploadDeferred from '@/components/pdf-upload-deferred'
import { uploadImageToS3, uploadPdfToS3, deleteFromS3 } from '@/lib/s3-upload'
import { useConfirmDestructive } from '@/components/confirm-dialog'
import { 
  createVendorProfile, 
  getMyVendorProfile, 
  updateVendorProfile, 
  type VendorProfileRequest,
  createVendorPackage,
  updateVendorPackage,
  deleteVendorPackage,
  getMyVendorPackages,
  type VendorPackageRequest,
  type VendorPackageResponse
} from '@/lib/api/vendor-profile'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { VENDOR_CATEGORIES } from '@/lib/constants/vendor-categories'
import { PROVINCES } from '@/lib/constants/provinces'

const PRICE_RANGES = ['$', '$$', '$$$', '$$$$']

export default function VendorProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const confirmDestructive = useConfirmDestructive()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  
  const [formData, setFormData] = useState<VendorProfileRequest>({
    businessName: '',
    category: '',
    description: '',
    serviceAreas: [],
    baseLocation: '',
    phone: '',
    instagramUrl: '',
    facebookUrl: '',
    priceRange: '',
    pricingPdfUrl: '',
    imageUrls: [],
  })

  // Separate state for pending uploads (files not yet uploaded to S3)
  const [pendingImages, setPendingImages] = useState<ImageFile[]>([])
  const [pendingPdf, setPendingPdf] = useState<File | null>(null)
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [packages, setPackages] = useState<VendorPackageResponse[]>([])
  const [isLoadingPackages, setIsLoadingPackages] = useState(false)
  const [editingPackage, setEditingPackage] = useState<VendorPackageResponse | null>(null)
  const [isAddingPackage, setIsAddingPackage] = useState(false)
  const [packageForm, setPackageForm] = useState<VendorPackageRequest>({
    name: '',
    priceFrom: undefined,
    priceTo: undefined,
    description: '',
    features: [],
    displayOrder: 0,
  })
  const [featureInput, setFeatureInput] = useState('')

  // Check if user is authenticated and has VENDOR role
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user && !user.roles?.includes('VENDOR')) {
      router.push('/subscription')
      return
    }

    // Load existing profile if it exists
    loadProfile()
  }, [authLoading, isAuthenticated, user, router])

  const loadProfile = async () => {
    setIsLoadingProfile(true)
    try {
      const profile = await getMyVendorProfile()
      if (profile) {
        setFormData({
          businessName: profile.businessName,
          category: profile.category,
          description: profile.description || '',
          serviceAreas: profile.serviceAreas || [],
          baseLocation: profile.baseLocation || '',
          phone: profile.phone || '',
          instagramUrl: profile.instagramUrl || '',
          facebookUrl: profile.facebookUrl || '',
          priceRange: profile.priceRange || '',
          pricingPdfUrl: profile.pricingPdfUrl || '',
          imageUrls: profile.imageUrls || [],
        })
        setExistingImageUrls(profile.imageUrls || [])
        setIsEditMode(true)
        // Load packages if profile exists
        await loadPackages()
      } else {
        // No profile exists - stay in create mode
        setIsEditMode(false)
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      // Even if there's an error, allow creating a new profile
      setIsEditMode(false)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const loadPackages = async () => {
    setIsLoadingPackages(true)
    try {
      const loadedPackages = await getMyVendorPackages()
      setPackages(loadedPackages)
    } catch (err) {
      console.error('Error loading packages:', err)
    } finally {
      setIsLoadingPackages(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRemoveExistingImage = async (url: string) => {
    // In edit mode, show confirmation dialog
    if (isEditMode) {
      const confirmed = await confirmDestructive(
        'Are you sure you want to delete this image? This will remove it from AWS S3 and cannot be undone.'
      )
      if (!confirmed) {
        return // User cancelled
      }
    }

    // Remove from UI immediately
    setExistingImageUrls(prev => prev.filter(u => u !== url))
    
    // Delete from S3 (only in edit mode, since new images aren't in S3 yet)
    if (isEditMode) {
      try {
        await deleteFromS3(url)
        console.log('Image deleted from S3:', url)
      } catch (err) {
        console.error('Error deleting image from S3:', err)
        // If deletion fails, add it back to the list
        setExistingImageUrls(prev => [...prev, url])
        alert('Failed to delete image from S3. Please try again.')
      }
    }
  }

  const handleRemoveExistingPdf = async () => {
    if (formData.pricingPdfUrl) {
      const pdfUrl = formData.pricingPdfUrl
      
      // In edit mode, show confirmation dialog
      if (isEditMode) {
        const confirmed = await confirmDestructive(
          'Are you sure you want to delete this PDF? This will remove it from AWS S3 and cannot be undone.'
        )
        if (!confirmed) {
          return // User cancelled
        }
      }
      
      // Remove from UI immediately
      setFormData(prev => ({ ...prev, pricingPdfUrl: '' }))
      
      // Delete from S3 (only in edit mode, since new PDFs aren't in S3 yet)
      if (isEditMode) {
        try {
          await deleteFromS3(pdfUrl)
          console.log('PDF deleted from S3:', pdfUrl)
        } catch (err) {
          console.error('Error deleting PDF from S3:', err)
          // If deletion fails, restore it
          setFormData(prev => ({ ...prev, pricingPdfUrl: pdfUrl }))
          alert('Failed to delete PDF from S3. Please try again.')
        }
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    setUploadProgress('')

    try {
      // Validate total images
      const totalImages = existingImageUrls.length + pendingImages.length
      if (totalImages > 5) {
        throw new Error('Maximum 5 images allowed')
      }

      let completedUploads = 0

      // Step 1: Upload pending images to S3
      const uploadedImageUrls: string[] = []
      for (let i = 0; i < pendingImages.length; i++) {
        setUploadProgress(`Uploading images... (${i + 1}/${pendingImages.length})`)
        try {
          const imageUrl = await uploadImageToS3(pendingImages[i].file)
          uploadedImageUrls.push(imageUrl) // Store original URL (compressed if needed)
          completedUploads++
        } catch (err) {
          console.error('Error uploading image:', err)
          throw new Error(`Failed to upload image ${i + 1}`)
        }
      }

      // Step 3: Upload pending PDF to S3
      let pdfUrl = formData.pricingPdfUrl
      if (pendingPdf) {
        setUploadProgress('Uploading PDF...')
        try {
          pdfUrl = await uploadPdfToS3(pendingPdf)
          completedUploads++
        } catch (err) {
          console.error('Error uploading PDF:', err)
          throw new Error('Failed to upload PDF')
        }
      }

      // Step 4: Combine all image URLs
      const allImageUrls = [...existingImageUrls, ...uploadedImageUrls]

      // Step 5: Create/update profile with S3 URLs
      setUploadProgress('Saving profile...')
      const profileData = {
        ...formData,
        imageUrls: allImageUrls,
        pricingPdfUrl: pdfUrl,
      }

      console.log('Submitting vendor profile with imageUrls:', profileData.imageUrls)

      if (isEditMode) {
        const response = await updateVendorProfile(profileData)
        console.log('Update response:', response)
        // After successful update, redirect to dashboard
        setUploadProgress('Profile updated successfully! Redirecting...')
        await new Promise(resolve => setTimeout(resolve, 500))
        window.location.href = '/vendor-dashboard'
      } else {
        const response = await createVendorProfile(profileData)
        console.log('Create response:', response)
        // After successful create, redirect to questions
        setUploadProgress('Success! Redirecting...')
        await new Promise(resolve => setTimeout(resolve, 500))
        window.location.href = '/vendor-questions'
      }
    } catch (err) {
      console.error('Error saving vendor profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to save vendor profile. Please try again.')
      setIsLoading(false)
      setUploadProgress('')
    }
  }

  if (authLoading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Text>Loading...</Text>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  if (user && !user.roles?.includes('VENDOR')) {
    return null // Will redirect
  }

  return (
    <form onSubmit={handleSubmit} className="grid w-full max-w-2xl grid-cols-1 gap-8">
      <h1 className="sr-only">{isEditMode ? 'Edit' : 'Create'} Vendor Profile</h1>

      <div>
        <Link href="/">
          <Logo className="text-text" />
        </Link>
        <Text className="mt-5 text-text/70">
          {isEditMode 
            ? 'Update your vendor profile information below.' 
            : 'Create your vendor profile to start listing your services on TieTheKnot.'}
        </Text>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <Text className="text-sm text-red-800 dark:text-red-200">{error}</Text>
        </div>
      )}

      <Field>
        <Label>Business Name *</Label>
        <Input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          required
          placeholder="e.g., Dream Wedding Photography"
        />
      </Field>

      <Field>
        <Label>Category *</Label>
        <Select
          name="category"
          value={formData.category}
          onChange={handleSelectChange}
          required
        >
          <option value="">Select a category</option>
          {VENDOR_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </Field>

      <Field>
        <Label>Price Range</Label>
        <Select
          name="priceRange"
          value={formData.priceRange}
          onChange={handleSelectChange}
        >
          <option value="">Select a price range</option>
          {PRICE_RANGES.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </Select>
      </Field>

      <Field>
        <Label>Description</Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Tell couples about your services, experience, and what makes you special..."
        />
      </Field>

      <Field>
        <Label>Base Location</Label>
        <Input
          type="text"
          name="baseLocation"
          value={formData.baseLocation}
          onChange={handleChange}
          placeholder="e.g., Colombo, Kandy, Galle"
        />
      </Field>

      <Field>
        <Label>Service Areas (Provinces) *</Label>
        <div className="space-y-2 mt-2">
          {PROVINCES.map((province) => (
            <label key={province} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.serviceAreas?.includes(province) ?? false}
                onChange={(e) => {
                  const currentAreas = formData.serviceAreas || []
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      serviceAreas: [...currentAreas, province],
                    })
                  } else {
                    setFormData({
                      ...formData,
                      serviceAreas: currentAreas.filter((p) => p !== province),
                    })
                  }
                }}
                className="rounded border-zinc-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-zinc-700">{province}</span>
            </label>
          ))}
        </div>
        {(formData.serviceAreas?.length ?? 0) === 0 && (
          <p className="text-sm text-red-600 mt-1">Please select at least one province</p>
        )}
      </Field>

      <Field>
        <Label>Business Contact Number</Label>
        <Input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="0771234567"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <Label>Instagram URL</Label>
          <Input
            type="url"
            name="instagramUrl"
            value={formData.instagramUrl}
            onChange={handleChange}
            placeholder="https://instagram.com/yourhandle"
          />
        </Field>

        <Field>
          <Label>Facebook URL</Label>
          <Input
            type="url"
            name="facebookUrl"
            value={formData.facebookUrl}
            onChange={handleChange}
            placeholder="https://facebook.com/yourpage"
          />
        </Field>
      </div>

      {/* Portfolio Images */}
      <div>
        <ImageUploadDeferred
          files={pendingImages}
          onChange={setPendingImages}
          existingUrls={existingImageUrls}
          onRemoveExisting={handleRemoveExistingImage}
          maxImages={5}
          label="Portfolio Images"
          helperText="Upload up to 5 images showcasing your work. JPEG, PNG, or WebP. Max 10MB each."
        />
      </div>

      {/* Pricing PDF */}
      <div>
        <PdfUploadDeferred
          file={pendingPdf}
          onChange={setPendingPdf}
          existingUrl={formData.pricingPdfUrl || null}
          onRemoveExisting={handleRemoveExistingPdf}
          label="Pricing PDF (Optional)"
          helperText="Upload your pricing document. PDF only. Max 20MB."
        />
      </div>

      {/* Package Management Section */}
      {isEditMode && (
        <div className="space-y-4 rounded-lg border border-text/20 bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Pricing Packages</h2>
              <Text className="mt-1 text-sm text-text/70">
                Add up to 5 packages to give couples an idea of your pricing
              </Text>
            </div>
            {packages.length < 5 && !editingPackage && !isAddingPackage && (
              <Button
                type="button"
                onClick={() => {
                  setIsAddingPackage(true)
                  setEditingPackage(null)
                  setPackageForm({
                    name: '',
                    priceFrom: undefined,
                    priceTo: undefined,
                    description: '',
                    features: [],
                    displayOrder: packages.length,
                  })
                  setFeatureInput('')
                }}
              >
                Add Package
              </Button>
            )}
          </div>

          {isLoadingPackages ? (
            <Text className="text-sm text-zinc-500">Loading packages...</Text>
          ) : (
            <div className="space-y-4">
              {packages.length === 0 && !editingPackage && !isAddingPackage && (
                <Text className="text-sm text-zinc-500">No packages added yet. Click &quot;Add Package&quot; to get started.</Text>
              )}
              {packages.map((pkg) => (
                <div key={pkg.id} className="rounded-md border border-text/20 bg-zinc-100 dark:bg-zinc-800 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{pkg.name}</h3>
                      {(pkg.priceFrom || pkg.priceTo) && (
                        <Text className="mt-1 text-sm text-text/70">
                          {pkg.priceFrom && pkg.priceTo
                            ? `$${pkg.priceFrom} - $${pkg.priceTo}`
                            : pkg.priceFrom
                            ? `From $${pkg.priceFrom}`
                            : `Up to $${pkg.priceTo}`}
                        </Text>
                      )}
                      {pkg.description && (
                        <Text className="mt-1 text-sm text-text/70">{pkg.description}</Text>
                      )}
                      {pkg.features && pkg.features.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="text-xs text-zinc-500">• {feature}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingPackage(pkg)
                          setIsAddingPackage(false)
                          setPackageForm({
                            name: pkg.name,
                            priceFrom: pkg.priceFrom,
                            priceTo: pkg.priceTo,
                            description: pkg.description || '',
                            features: pkg.features || [],
                            displayOrder: pkg.displayOrder,
                          })
                          setFeatureInput('')
                        }}
                        outline
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this package?')) {
                            try {
                              await deleteVendorPackage(pkg.id)
                              await loadPackages()
                            } catch (err) {
                              console.error('Error deleting package:', err)
                              alert('Failed to delete package. Please try again.')
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                        outline
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {isAddingPackage && (
                <div className="rounded-md border-2 border-dashed border-text/30 bg-zinc-100 dark:bg-zinc-800 p-4">
                  <Field>
                    <Label>Package Name *</Label>
                    <Input
                      type="text"
                      value={packageForm.name}
                      onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                      placeholder="e.g., Standard Package"
                      required
                    />
                  </Field>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <Field>
                      <Label>Price From ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={packageForm.priceFrom || ''}
                        onChange={(e) => setPackageForm({ ...packageForm, priceFrom: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder="150.00"
                      />
                    </Field>
                    <Field>
                      <Label>Price To ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={packageForm.priceTo || ''}
                        onChange={(e) => setPackageForm({ ...packageForm, priceTo: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder="300.00"
                      />
                    </Field>
                  </div>

                  <Field className="mt-4">
                    <Label>Description</Label>
                    <Textarea
                      value={packageForm.description}
                      onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                      rows={3}
                      placeholder="Describe what's included in this package..."
                    />
                  </Field>

                  <Field className="mt-4">
                    <Label>Features</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          placeholder="e.g., 8 hours coverage"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              if (featureInput.trim()) {
                                setPackageForm({
                                  ...packageForm,
                                  features: [...(packageForm.features || []), featureInput.trim()],
                                })
                                setFeatureInput('')
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (featureInput.trim()) {
                              setPackageForm({
                                ...packageForm,
                                features: [...(packageForm.features || []), featureInput.trim()],
                              })
                              setFeatureInput('')
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      {packageForm.features && packageForm.features.length > 0 && (
                        <div className="space-y-1">
                          {packageForm.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800 p-2">
                              <span className="flex-1 text-sm">{feature}</span>
                              <Button
                                type="button"
                                onClick={() => {
                                  setPackageForm({
                                    ...packageForm,
                                    features: packageForm.features?.filter((_, i) => i !== index) || [],
                                  })
                                }}
                                className="text-red-600 hover:text-red-700 dark:text-red-400"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>

                  <div className="mt-4 flex gap-2">
                    <Button
                      type="button"
                      onClick={async () => {
                        if (!packageForm.name) {
                          alert('Package name is required')
                          return
                        }
                        if (!packageForm.priceFrom && !packageForm.priceTo) {
                          alert('At least one price (From or To) is required')
                          return
                        }
                        try {
                          await createVendorPackage(packageForm)
                          await loadPackages()
                          setEditingPackage(null)
                          setIsAddingPackage(false)
                          setPackageForm({
                            name: '',
                            priceFrom: undefined,
                            priceTo: undefined,
                            description: '',
                            features: [],
                            displayOrder: packages.length + 1,
                          })
                          setFeatureInput('')
                        } catch (err) {
                          console.error('Error creating package:', err)
                          alert(err instanceof Error ? err.message : 'Failed to create package. Please try again.')
                        }
                      }}
                    >
                      Save Package
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setEditingPackage(null)
                        setIsAddingPackage(false)
                        setPackageForm({
                          name: '',
                          priceFrom: undefined,
                          priceTo: undefined,
                          description: '',
                          features: [],
                          displayOrder: packages.length,
                        })
                        setFeatureInput('')
                      }}
                      outline
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {editingPackage && !isAddingPackage && (
                <div className="rounded-md border-2 border-blue-300 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
                  <h3 className="font-semibold">Editing: {editingPackage.name}</h3>
                  <Field className="mt-4">
                    <Label>Package Name *</Label>
                    <Input
                      type="text"
                      value={packageForm.name}
                      onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                      required
                    />
                  </Field>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <Field>
                      <Label>Price From ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={packageForm.priceFrom || ''}
                        onChange={(e) => setPackageForm({ ...packageForm, priceFrom: e.target.value ? parseFloat(e.target.value) : undefined })}
                      />
                    </Field>
                    <Field>
                      <Label>Price To ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={packageForm.priceTo || ''}
                        onChange={(e) => setPackageForm({ ...packageForm, priceTo: e.target.value ? parseFloat(e.target.value) : undefined })}
                      />
                    </Field>
                  </div>

                  <Field className="mt-4">
                    <Label>Description</Label>
                    <Textarea
                      value={packageForm.description}
                      onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                      rows={3}
                    />
                  </Field>

                  <Field className="mt-4">
                    <Label>Features</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              if (featureInput.trim()) {
                                setPackageForm({
                                  ...packageForm,
                                  features: [...(packageForm.features || []), featureInput.trim()],
                                })
                                setFeatureInput('')
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (featureInput.trim()) {
                              setPackageForm({
                                ...packageForm,
                                features: [...(packageForm.features || []), featureInput.trim()],
                              })
                              setFeatureInput('')
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      {packageForm.features && packageForm.features.length > 0 && (
                        <div className="space-y-1">
                          {packageForm.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800 p-2">
                              <span className="flex-1 text-sm">{feature}</span>
                              <Button
                                type="button"
                                onClick={() => {
                                  setPackageForm({
                                    ...packageForm,
                                    features: packageForm.features?.filter((_, i) => i !== index) || [],
                                  })
                                }}
                                className="text-red-600 hover:text-red-700 dark:text-red-400"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>

                  <div className="mt-4 flex gap-2">
                    <Button
                      type="button"
                      onClick={async () => {
                        if (!packageForm.name) {
                          alert('Package name is required')
                          return
                        }
                        if (!packageForm.priceFrom && !packageForm.priceTo) {
                          alert('At least one price (From or To) is required')
                          return
                        }
                        try {
                          await updateVendorPackage(editingPackage.id, packageForm)
                          await loadPackages()
                          setEditingPackage(null)
                          setIsAddingPackage(false)
                          setPackageForm({
                            name: '',
                            priceFrom: undefined,
                            priceTo: undefined,
                            description: '',
                            features: [],
                            displayOrder: 0,
                          })
                          setFeatureInput('')
                        } catch (err) {
                          console.error('Error updating package:', err)
                          alert(err instanceof Error ? err.message : 'Failed to update package. Please try again.')
                        }
                      }}
                    >
                      Update Package
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setEditingPackage(null)
                        setIsAddingPackage(false)
                        setPackageForm({
                          name: '',
                          priceFrom: undefined,
                          priceTo: undefined,
                          description: '',
                          features: [],
                          displayOrder: 0,
                        })
                        setFeatureInput('')
                      }}
                      outline
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {uploadProgress && (
        <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
          <Text className="text-sm text-blue-800 dark:text-blue-200">{uploadProgress}</Text>
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? uploadProgress || 'Saving...' : isEditMode ? 'Update Profile' : 'Create Profile'}
        </Button>
        <Button
          type="button"
          onClick={() => router.back()}
          outline
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

