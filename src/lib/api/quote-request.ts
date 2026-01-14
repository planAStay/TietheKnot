import { API_ENDPOINTS, getAuthHeaders } from './config'
import { QuoteRequest, QuoteRequestAnswer, Quote, QuoteMessage, QuoteStatus, AuthorRole, TimeSlot } from '@/type'

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

export interface CreateQuoteRequestPayload {
  clientName: string
  email: string
  phone: string
  weddingDate: string
  guestCount: number
  location: string
  timeSlot: TimeSlot
  answers: Array<{
    questionText: string
    answerText: string
  }>
}

export async function createQuoteRequest(
  vendorProfileId: number,
  payload: CreateQuoteRequestPayload
): Promise<QuoteRequest> {
  const response = await fetch(`${API_ENDPOINTS.quoteRequests.base}/${vendorProfileId}`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse<QuoteRequest>(response)
}

export async function getMyQuoteRequests(): Promise<QuoteRequest[]> {
  const response = await fetch(API_ENDPOINTS.quoteRequests.me, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse<QuoteRequest[]>(response)
}

export async function getVendorQuoteRequests(): Promise<QuoteRequest[]> {
  const response = await fetch(API_ENDPOINTS.quoteRequests.vendor, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse<QuoteRequest[]>(response)
}

export async function getQuoteRequestById(id: number): Promise<QuoteRequest> {
  const response = await fetch(`${API_ENDPOINTS.quoteRequests.base}/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse<QuoteRequest>(response)
}


export interface CreateOrUpdateQuotePayload {
  amount: number
  notes?: string
}

export async function createOrUpdateQuote(
  quoteRequestId: number,
  payload: CreateOrUpdateQuotePayload
): Promise<QuoteRequest> {
  const response = await fetch(`${API_ENDPOINTS.quoteRequests.base}/${quoteRequestId}/quote`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse<QuoteRequest>(response)
}

export interface AddQuoteMessagePayload {
  message: string
  // authorRole is automatically determined by the backend based on user's relationship to the quote request
}

export async function addMessage(
  quoteRequestId: number,
  payload: AddQuoteMessagePayload
): Promise<QuoteRequest> {
  const response = await fetch(`${API_ENDPOINTS.quoteRequests.base}/${quoteRequestId}/messages`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse<QuoteRequest>(response)
}

export async function acceptQuote(quoteRequestId: number): Promise<QuoteRequest> {
  const response = await fetch(`${API_ENDPOINTS.quoteRequests.base}/${quoteRequestId}/accept`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  return handleResponse<QuoteRequest>(response)
}

export async function declineQuote(quoteRequestId: number): Promise<QuoteRequest> {
  const response = await fetch(`${API_ENDPOINTS.quoteRequests.base}/${quoteRequestId}/decline`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  return handleResponse<QuoteRequest>(response)
}

export async function createBooking(quoteRequestId: number): Promise<QuoteRequest> {
  const response = await fetch(`${API_ENDPOINTS.quoteRequests.base}/${quoteRequestId}/booking`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  return handleResponse<QuoteRequest>(response)
}

