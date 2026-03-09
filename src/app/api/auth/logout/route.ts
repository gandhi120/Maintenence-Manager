import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  console.log('Logout API: All cookies:', allCookies.map(c => c.name))

  // Redirect to /login
  const response = NextResponse.redirect(new URL('/login', request.url))

  // Force delete ALL Supabase cookies on the redirect response
  for (const cookie of allCookies) {
    if (cookie.name.startsWith('sb-')) {
      console.log('Logout API: Clearing cookie:', cookie.name)
      response.cookies.set(cookie.name, '', {
        maxAge: 0,
        path: '/',
        expires: new Date(0),
      })
    }
  }

  return response
}
