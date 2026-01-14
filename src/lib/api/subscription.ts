import { API_ENDPOINTS, getAuthHeaders } from './config'

export interface SubscriptionRequest {
  tier: 'FOUNDING' | 'STARTER' | 'PRO'
  billingPeriod?: 'MONTHLY' | 'YEARLY'
}

export interface SubscriptionResponse {
  id: number
  tier: string
  billingPeriod: string
  price: number
  startDate: string
  endDate: string | null
  isActive: boolean
  orderId: string | null
  status: boolean
  maxListings: number
  maxVendorQuestions: number
  isLifetime: boolean
}

export interface PricingInfo {
  [key: string]: {
    monthlyPrice: number
    yearlyPrice: number
    maxListings: number
    maxVendorQuestions: number
    isLifetime: boolean
    savings: number
    discountPercentage: number
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      status: response.status,
      error: 'Unknown Error',
      message: response.statusText,
    }))
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function subscribe(data: SubscriptionRequest): Promise<SubscriptionResponse> {
  const response = await fetch(API_ENDPOINTS.subscriptions.subscribe, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  return handleResponse<SubscriptionResponse>(response)
}

export async function getCurrentSubscription(): Promise<SubscriptionResponse | null> {
  const response = await fetch(API_ENDPOINTS.subscriptions.current, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await handleResponse<{ message?: string } | SubscriptionResponse>(response)
  
  if ('message' in data) {
    return null
  }
  
  return data as SubscriptionResponse
}

export async function getPricingInfo(): Promise<PricingInfo> {
  const response = await fetch(API_ENDPOINTS.subscriptions.pricing, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse<PricingInfo>(response)
}

export async function selectVendorRole(): Promise<SubscriptionResponse> {
  // Special endpoint for vendor selection - creates FOUNDING subscription
  const response = await fetch(API_ENDPOINTS.subscriptions.selectVendor, {
    method: 'POST',
    headers: getAuthHeaders(),
  })

  return handleResponse<SubscriptionResponse>(response)
}

