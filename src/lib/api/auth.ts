import { API_ENDPOINTS, getAuthHeaders, removeAuthToken, setAuthToken } from './config'

export interface RegisterRequest {
  username: string
  password: string
  name: string
  email: string
  phoneNumber?: string
  phoneCountryCode?: string
}

export interface LoginRequest {
  emailOrUsername: string
  password: string
}

export interface AuthResponse {
  token: string
  type: string
  id: number
  username: string
  email: string
  name: string
  roles: string[]
}

export interface UserResponse {
  id: number
  username: string
  name: string
  email: string
  phoneNumber?: string
  phoneCountryCode?: string
  verified: boolean
  status: boolean
  profilePicture?: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

export interface UserUpdateRequest {
  name: string
  phoneNumber?: string
  phoneCountryCode?: string
  profilePicture?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface ApiError {
  timestamp?: string
  status: number
  error: string
  message: string
  path?: string
  errors?: Record<string, string>
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      status: response.status,
      error: 'Unknown Error',
      message: response.statusText,
    }))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(API_ENDPOINTS.auth.register, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const authResponse = await handleResponse<AuthResponse>(response)
  
  // Store token
  if (authResponse.token) {
    setAuthToken(authResponse.token)
  }
  
  return authResponse
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(API_ENDPOINTS.auth.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const authResponse = await handleResponse<AuthResponse>(response)
  
  // Store token
  if (authResponse.token) {
    setAuthToken(authResponse.token)
  }
  
  return authResponse
}

export async function getCurrentUser(): Promise<UserResponse> {
  const response = await fetch(API_ENDPOINTS.auth.me, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  return handleResponse<UserResponse>(response)
}

export async function updateUser(data: UserUpdateRequest): Promise<UserResponse> {
  const response = await fetch(API_ENDPOINTS.auth.me, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return handleResponse<UserResponse>(response)
}

export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  const response = await fetch(`${API_ENDPOINTS.auth.me.replace('/me', '')}/password`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      status: response.status,
      error: 'Unknown Error',
      message: response.statusText,
    }))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
  const response = await fetch(API_ENDPOINTS.auth.forgotPassword, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return handleResponse<{ message: string }>(response)
}

export async function resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
  const response = await fetch(API_ENDPOINTS.auth.resetPassword, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return handleResponse<{ message: string }>(response)
}

export async function logout(): Promise<void> {
  try {
    await fetch(API_ENDPOINTS.auth.logout, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Always remove token from storage
    removeAuthToken()
  }
}

