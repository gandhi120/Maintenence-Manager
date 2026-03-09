'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { UserRole } from '@/shared/types/common.types'

type AuthContext = {
  user: User | null
  role: UserRole | null
  loading: boolean
}

const Context = createContext<AuthContext>({ user: null, role: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchUserAndRole(authUser: User | null) {
      if (!authUser) {
        setUser(null)
        setRole(null)
        setLoading(false)
        return
      }

      setUser(authUser)

      try {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', authUser.id)
          .single()

        if (profile?.role === 'technician') {
          setRole('technician')
        } else {
          setRole('manager')
        }
      } catch {
        // Default to manager if profile fetch fails (e.g. Supabase not configured)
        setRole('manager')
      }

      setLoading(false)
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      fetchUserAndRole(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserAndRole(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Context.Provider value={{ user, role, loading }}>
      {children}
    </Context.Provider>
  )
}

export function useAuth() {
  return useContext(Context)
}

export function useUserRole() {
  const { role } = useContext(Context)
  return role
}
