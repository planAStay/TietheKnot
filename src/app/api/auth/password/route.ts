import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'tietheknot-testing-auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    // Get password from environment variable
    const testingPassword = process.env.TESTING_PASSWORD

    if (!testingPassword) {
      console.error('TESTING_PASSWORD environment variable is not set')
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Validate password (simple string comparison)
    if (password !== testingPassword) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password' },
        { status: 401 }
      )
    }

    // Set HTTP-only secure cookie
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })

    return NextResponse.json(
      { success: true, message: 'Authentication successful' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password validation error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during authentication' },
      { status: 500 }
    )
  }
}

