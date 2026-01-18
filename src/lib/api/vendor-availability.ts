import { API_ENDPOINTS, getAuthHeaders } from './config'

export interface VendorAvailabilityResponse {
  date: string // ISO date string
  slot: 'morning' | 'evening'
  status: 'confirmed' | 'blocked'
}

export async function getVendorAvailability(vendorProfileId: number): Promise<VendorAvailabilityResponse[]> {
  const response = await fetch(`${API_ENDPOINTS.vendorProfiles.base}/${vendorProfileId}/availability`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

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

