'use client'

import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Textarea } from '@/components/textarea'
import { Text, TextLink } from '@/components/text'
import { useAuth } from '@/lib/auth-context'
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

const VENDOR_CATEGORIES = [
  'Photography',
  'Videography',
  'Catering',
  'Floral & Decor',
  'Music & Entertainment',
  'Venue',
  'Wedding Planner',
  'Makeup & Hair',
  'Transportation',
  'Other',
]

const PRICE_RANGES = ['$', '$$', '$$$', '$$$$']

export default function VendorProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  
  const [formData, setFormData] = useState<VendorProfileRequest>({
    businessName: '',
    category: '',
    description: '',
    serviceArea: '',
    phone: '',
    whatsapp: '',
    priceRange: '',
    pricingPdfUrl: '',
    imageUrls: [],
  })

  const [imageUrlInput, setImageUrlInput] = useState('')
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
          serviceArea: profile.serviceArea || '',
          phone: profile.phone || '',
          whatsapp: profile.whatsapp || '',
          priceRange: profile.priceRange || '',
          pricingPdfUrl: profile.pricingPdfUrl || '',
          imageUrls: profile.imageUrls || [],
        })
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

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim() && formData.imageUrls && formData.imageUrls.length < 5) {
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), imageUrlInput.trim()],
      }))
      setImageUrlInput('')
    }
  }

  const handleRemoveImageUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate image URLs count
      if (formData.imageUrls && formData.imageUrls.length > 5) {
        throw new Error('Maximum 5 images allowed')
      }

      // Debug: Log what we're sending
      console.log('Submitting vendor profile with imageUrls:', formData.imageUrls)

      if (isEditMode) {
        const response = await updateVendorProfile(formData)
        console.log('Update response:', response)
      } else {
        const response = await createVendorProfile(formData)
        console.log('Create response:', response)
      }
      
      // After successful create/update, wait a moment for DB to commit, then redirect
      // Use window.location for a hard redirect to ensure the page fully reloads
      await new Promise(resolve => setTimeout(resolve, 500))
      window.location.href = '/vendor-questions'
    } catch (err) {
      console.error('Error saving vendor profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to save vendor profile. Please try again.')
      setIsLoading(false)
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
          <Logo className="text-zinc-950 dark:text-white" />
        </Link>
        <Text className="mt-5 text-zinc-600">
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
        <Label>Service Area</Label>
        <Input
          type="text"
          name="serviceArea"
          value={formData.serviceArea}
          onChange={handleChange}
          placeholder="e.g., Colombo, Kandy, Galle"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <Label>Phone</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0771234567"
          />
        </Field>

        <Field>
          <Label>WhatsApp</Label>
          <Input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="0771234567"
          />
        </Field>
      </div>

      <Field>
        <Label>Pricing PDF URL</Label>
        <Input
          type="url"
          name="pricingPdfUrl"
          value={formData.pricingPdfUrl}
          onChange={handleChange}
          placeholder="https://example.com/pricing.pdf"
        />
        <Text className="mt-1 text-xs text-zinc-500">
          Optional: Link to your pricing PDF document
        </Text>
      </Field>

      <Field>
        <Label>Image URLs (Maximum 5)</Label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={formData.imageUrls ? formData.imageUrls.length >= 5 : false}
            />
            <Button
              type="button"
              onClick={handleAddImageUrl}
              disabled={!imageUrlInput.trim() || (formData.imageUrls ? formData.imageUrls.length >= 5 : false)}
            >
              Add
            </Button>
          </div>
          {formData.imageUrls && formData.imageUrls.length > 0 && (
            <div className="space-y-1">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2 rounded-md bg-zinc-100 p-2 dark:bg-zinc-800">
                  <span className="flex-1 truncate text-sm">{url}</span>
                  <Button
                    type="button"
                    onClick={() => handleRemoveImageUrl(index)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Text className="text-xs text-zinc-500">
            {formData.imageUrls ? formData.imageUrls.length : 0} / 5 images
          </Text>
        </div>
      </Field>

      {/* Package Management Section */}
      {isEditMode && (
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Pricing Packages</h2>
              <Text className="mt-1 text-sm text-zinc-600">
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
                <div key={pkg.id} className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{pkg.name}</h3>
                      {(pkg.priceFrom || pkg.priceTo) && (
                        <Text className="mt-1 text-sm text-zinc-600">
                          {pkg.priceFrom && pkg.priceTo
                            ? `$${pkg.priceFrom} - $${pkg.priceTo}`
                            : pkg.priceFrom
                            ? `From $${pkg.priceFrom}`
                            : `Up to $${pkg.priceTo}`}
                        </Text>
                      )}
                      {pkg.description && (
                        <Text className="mt-1 text-sm text-zinc-600">{pkg.description}</Text>
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
                <div className="rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
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
                            <div key={index} className="flex items-center gap-2 rounded-md bg-zinc-100 p-2 dark:bg-zinc-800">
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
                            <div key={index} className="flex items-center gap-2 rounded-md bg-zinc-100 p-2 dark:bg-zinc-800">
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

      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? 'Saving...' : isEditMode ? 'Update Profile' : 'Create Profile'}
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

