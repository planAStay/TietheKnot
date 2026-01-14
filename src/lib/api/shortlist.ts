import { API_ENDPOINTS, getAuthHeaders } from './config'
import { TShortlist } from '@/type'

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

export async function addToShortlist(vendorProfileId: number): Promise<TShortlist> {
  const response = await fetch(`${API_ENDPOINTS.shortlist.base}/${vendorProfileId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  return handleResponse<TShortlist>(response)
}

export async function removeFromShortlist(vendorProfileId: number): Promise<void> {
  const response = await fetch(`${API_ENDPOINTS.shortlist.base}/${vendorProfileId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    await handleResponse(response)
  }
}

export async function getMyShortlist(): Promise<TShortlist[]> {
  const response = await fetch(API_ENDPOINTS.shortlist.me, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse<TShortlist[]>(response)
}

export async function getShortlistByVendor(vendorProfileId: number): Promise<TShortlist[]> {
  const response = await fetch(`${API_ENDPOINTS.shortlist.vendor}/${vendorProfileId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse<TShortlist[]>(response)
}

