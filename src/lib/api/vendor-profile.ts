import { API_ENDPOINTS, getAuthHeaders } from './config'

export interface VendorPackageRequest {
  name: string
  priceFrom?: number
  priceTo?: number
  description?: string
  features?: string[]
  displayOrder?: number
}

export interface VendorPackageResponse {
  id: number
  name: string
  priceFrom?: number
  priceTo?: number
  description?: string
  features?: string[]
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface VendorProfileRequest {
  businessName: string
  category: string
  description?: string
  serviceArea?: string
  phone?: string
  whatsapp?: string
  priceRange?: string
  pricingPdfUrl?: string
  imageUrls?: string[]
}

export interface VendorProfileResponse {
  id: number
  businessName: string
  category: string
  description?: string
  serviceArea?: string
  phone?: string
  whatsapp?: string
  priceRange?: string
  pricingPdfUrl?: string
  imageUrls?: string[]
  packages?: VendorPackageResponse[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  userId: number
  userName: string
  userEmail: string
}

export interface VendorQuestionRequest {
  questionText: string
  required?: boolean
  displayOrder?: number
}

export interface VendorQuestionResponse {
  id: number
  questionText: string
  required: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      status: response.status,
      error: 'Unknown Error',
      message: response.statusText,
    }))
    throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Vendor Profile API
export async function createVendorProfile(data: VendorProfileRequest): Promise<VendorProfileResponse> {
  const response = await fetch(API_ENDPOINTS.vendorProfiles.base, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse<VendorProfileResponse>(response)
}

export async function updateVendorProfile(data: VendorProfileRequest): Promise<VendorProfileResponse> {
  const response = await fetch(API_ENDPOINTS.vendorProfiles.base, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse<VendorProfileResponse>(response)
}

export async function getMyVendorProfile(): Promise<VendorProfileResponse | null> {
  const response = await fetch(API_ENDPOINTS.vendorProfiles.me, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  
  if (response.status === 404) {
    return null
  }
  
  if (!response.ok) {
    // For other errors, still return null to allow creating a new profile
    const errorData = await response.json().catch(() => null)
    console.warn('Error fetching vendor profile:', errorData?.message || response.statusText)
    return null
  }
  
  return handleResponse<VendorProfileResponse>(response)
}

export async function getVendorProfileById(id: number): Promise<VendorProfileResponse> {
  const response = await fetch(`${API_ENDPOINTS.vendorProfiles.base}/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse<VendorProfileResponse>(response)
}

export async function getAllVendorProfiles(category?: string): Promise<VendorProfileResponse[]> {
  const url = category 
    ? `${API_ENDPOINTS.vendorProfiles.base}?category=${encodeURIComponent(category)}`
    : API_ENDPOINTS.vendorProfiles.base
  // Don't require auth for public browsing
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return handleResponse<VendorProfileResponse[]>(response)
}

export async function deleteVendorProfile(): Promise<void> {
  const response = await fetch(API_ENDPOINTS.vendorProfiles.me, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    await handleResponse(response) // Throws error if not ok
  }
}

// Vendor Question API
export async function createVendorQuestion(data: VendorQuestionRequest): Promise<VendorQuestionResponse> {
  const response = await fetch(API_ENDPOINTS.vendorQuestions.base, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse<VendorQuestionResponse>(response)
}

export async function updateVendorQuestion(id: number, data: VendorQuestionRequest): Promise<VendorQuestionResponse> {
  const response = await fetch(`${API_ENDPOINTS.vendorQuestions.base}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse<VendorQuestionResponse>(response)
}

export async function deleteVendorQuestion(id: number): Promise<void> {
  const response = await fetch(`${API_ENDPOINTS.vendorQuestions.base}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    await handleResponse(response) // Throws error if not ok
  }
}

export async function getMyVendorQuestions(): Promise<VendorQuestionResponse[]> {
  const response = await fetch(API_ENDPOINTS.vendorQuestions.me, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse<VendorQuestionResponse[]>(response)
}

export async function getVendorQuestionsByProfile(profileId: number): Promise<VendorQuestionResponse[]> {
  const response = await fetch(API_ENDPOINTS.vendorQuestions.byProfile(profileId), {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse<VendorQuestionResponse[]>(response)
}

// Vendor Package API
export async function createVendorPackage(data: VendorPackageRequest): Promise<VendorPackageResponse> {
  const response = await fetch(API_ENDPOINTS.vendorPackages.base, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse<VendorPackageResponse>(response)
}

export async function updateVendorPackage(id: number, data: VendorPackageRequest): Promise<VendorPackageResponse> {
  const response = await fetch(`${API_ENDPOINTS.vendorPackages.base}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse<VendorPackageResponse>(response)
}

export async function deleteVendorPackage(id: number): Promise<void> {
  const response = await fetch(`${API_ENDPOINTS.vendorPackages.base}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    await handleResponse(response) // Throws error if not ok
  }
}

export async function getMyVendorPackages(): Promise<VendorPackageResponse[]> {
  const response = await fetch(API_ENDPOINTS.vendorPackages.me, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse<VendorPackageResponse[]>(response)
}

export async function getVendorPackagesByProfile(profileId: number): Promise<VendorPackageResponse[]> {
  const response = await fetch(API_ENDPOINTS.vendorPackages.byProfile(profileId), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return handleResponse<VendorPackageResponse[]>(response)
}

