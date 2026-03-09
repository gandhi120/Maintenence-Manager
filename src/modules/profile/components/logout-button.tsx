'use client'

import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    setLoading(true)

    console.log('=== LOGOUT START ===')
    console.log('Cookies BEFORE:', document.cookie)

    // Clear ALL sb- cookies (Supabase auth cookies)
    const cookies = document.cookie.split(';')
    console.log('Total cookies found:', cookies.length)

    for (const cookie of cookies) {
      const name = cookie.trim().split('=')[0]
      console.log('Cookie name:', JSON.stringify(name), 'starts with sb-:', name.startsWith('sb-'))
      if (name && name.startsWith('sb-')) {
        // Try every combination to make sure it gets deleted
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.localhost`
        document.cookie = `${name}=; max-age=0; path=/`
        document.cookie = `${name}=; max-age=0; path=/; domain=localhost`
        console.log('Cleared cookie:', name)
      }
    }

    // Clear Supabase data from localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && key.startsWith('sb-')) {
        localStorage.removeItem(key)
        console.log('Cleared localStorage:', key)
      }
    }

    // Clear sessionStorage
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith('sb-')) {
        sessionStorage.removeItem(key)
        console.log('Cleared sessionStorage:', key)
      }
    }

    console.log('Cookies AFTER:', document.cookie)
    console.log('=== LOGOUT END ===')

    // Full page reload to /login
    window.location.href = '/login'
  }

  return (
    <Button
      variant="outline"
      className="w-full border-danger/30 text-danger hover:bg-danger/10"
      onClick={handleLogout}
      disabled={loading}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? 'Signing out...' : 'Sign Out'}
    </Button>
  )
}
