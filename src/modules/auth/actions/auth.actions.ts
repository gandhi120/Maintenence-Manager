'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function sendOTP(phone: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    phone,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function verifyOTP(phone: string, token: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })

  if (error) {
    return { error: error.message }
  }

  let role: string = 'manager'

  // Upsert user profile
  if (data.user) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (existingUser) {
      role = existingUser.role
      // Update last_active_at
      await supabase
        .from('users')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', data.user.id)
    } else {
      // New user - upsert with default role
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: data.user.id,
          mobile_number: phone,
          name: data.user.user_metadata?.name || '',
          role: 'manager',
          last_active_at: new Date().toISOString(),
        }, { onConflict: 'id' })

      if (profileError) {
        console.error('Profile upsert error:', profileError)
      }
    }
  }

  return { success: true, role }
}

export async function logout() {
  const supabase = await createClient()
  console.log('--- Logout ---')
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Logout error:', error.message)
  } else {
    console.log('Logout successful — session cleared')
  }
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}
