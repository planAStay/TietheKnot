import { API_ENDPOINTS, getAuthToken } from './config'

export interface AdminVendorProfile {
  id: number
  businessName: string
  category: string
  serviceAreas: string[]
  baseLocation: string | null
  phone: string
  instagramUrl: string | null
  facebookUrl: string | null
  priceRange: string
  description: string
  imageUrls: string[]
  isActive: boolean
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  adminNotes: string | null
  approvedAt: string | null
  approvedBy: number | null
  createdAt: string
  updatedAt: string
  userId: number
  userName: string
  userEmail: string
}

export interface ApprovalRequest {
  notes: string
}

export interface UpdateVendorRequest {
  businessName: string
  category: string
  description: string
  serviceArea: string
  phone: string
  priceRange: string
  pricingPdfUrl: string
  imageUrls: string[]
  isActive: boolean
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function getPendingVendors(): Promise<AdminVendorProfile[]> {
  const token = getAuthToken()
  if (!token) throw new Error('Not authenticated')

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
  const response = await fetch(`${API_BASE_URL}/admin/vendors/pending`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse<AdminVendorProfile[]>(response)
}

export async function getAllVendorsAdmin(): Promise<AdminVendorProfile[]> {
  const token = getAuthToken()
  if (!token) throw new Error('Not authenticated')

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
  const response = await fetch(`${API_BASE_URL}/admin/vendors/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse<AdminVendorProfile[]>(response)
}

export async function approveVendor(
  id: number,
  notes: string = ''
): Promise<AdminVendorProfile> {
  const token = getAuthToken()
  if (!token) throw new Error('Not authenticated')

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
  const response = await fetch(`${API_BASE_URL}/admin/vendors/${id}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notes }),
  })

  return handleResponse<AdminVendorProfile>(response)
}

export async function rejectVendor(
  id: number,
  notes: string
): Promise<AdminVendorProfile> {
  const token = getAuthToken()
  if (!token) throw new Error('Not authenticated')

  if (!notes.trim()) {
    throw new Error('Rejection notes are required')
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
  const response = await fetch(`${API_BASE_URL}/admin/vendors/${id}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notes }),
  })

  return handleResponse<AdminVendorProfile>(response)
}

export async function getVendorByIdAdmin(id: number): Promise<AdminVendorProfile> {
  const token = getAuthToken()
  if (!token) throw new Error('Not authenticated')

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
  const response = await fetch(`${API_BASE_URL}/admin/vendors/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse<AdminVendorProfile>(response)
}

export async function updateVendorAsAdmin(
  id: number,
  data: UpdateVendorRequest
): Promise<AdminVendorProfile> {
  const token = getAuthToken()
  if (!token) throw new Error('Not authenticated')

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
  const response = await fetch(`${API_BASE_URL}/admin/vendors/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  return handleResponse<AdminVendorProfile>(response)
}

