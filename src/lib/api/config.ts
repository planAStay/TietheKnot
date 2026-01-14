// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    me: `${API_BASE_URL}/auth/me`,
    logout: `${API_BASE_URL}/auth/logout`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
  },
  subscriptions: {
    subscribe: `${API_BASE_URL}/subscriptions`,
    current: `${API_BASE_URL}/subscriptions/current`,
    pricing: `${API_BASE_URL}/subscriptions/pricing`,
    selectVendor: `${API_BASE_URL}/subscriptions/select-vendor`,
  },
  vendorProfiles: {
    base: `${API_BASE_URL}/vendor-profiles`,
    me: `${API_BASE_URL}/vendor-profiles/me`,
  },
  vendorQuestions: {
    base: `${API_BASE_URL}/vendor-questions`,
    me: `${API_BASE_URL}/vendor-questions/me`,
    byProfile: (profileId: number) => `${API_BASE_URL}/vendor-questions/profile/${profileId}`,
  },
  vendorPackages: {
    base: `${API_BASE_URL}/vendor-packages`,
    me: `${API_BASE_URL}/vendor-packages/me`,
    byProfile: (profileId: number) => `${API_BASE_URL}/vendor-packages/profile/${profileId}`,
  },
  shortlist: {
    base: `${API_BASE_URL}/shortlist`,
    me: `${API_BASE_URL}/shortlist/me`,
    vendor: `${API_BASE_URL}/shortlist/vendor`,
  },
  quoteRequests: {
    base: `${API_BASE_URL}/quote-requests`,
    me: `${API_BASE_URL}/quote-requests/me`,
    vendor: `${API_BASE_URL}/quote-requests/vendor`,
  },
} as const

// Token storage key
export const TOKEN_STORAGE_KEY = 'tietheknot_auth_token'

// Get stored token
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

// Save token
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

// Remove token
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

// Create headers with auth token
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

