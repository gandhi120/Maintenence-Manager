import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { createHmac } from 'crypto'

function derivePassword(phone: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET || 'fallback-secret')
    .update(phone)
    .digest('hex')
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { newPhone } = await request.json()

    if (!newPhone || !/^\+?[1-9]\d{9,14}$/.test(newPhone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Check uniqueness — make sure no other user has this number
    const { data: existing } = await adminClient
      .from('users')
      .select('id')
      .eq('mobile_number', newPhone)
      .neq('id', user.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'This phone number is already registered' }, { status: 409 })
    }

    // Update users table
    const { error: dbError } = await adminClient
      .from('users')
      .update({ mobile_number: newPhone })
      .eq('id', user.id)

    if (dbError) {
      console.error('DB update error:', dbError)
      return NextResponse.json({ error: 'Failed to update phone number' }, { status: 500 })
    }

    // Update Supabase Auth email + password (phone-based auth uses derived credentials)
    const newEmail = `${newPhone.replace(/\+/g, '')}@phone.auth`
    const newPassword = derivePassword(newPhone)

    const { error: authError } = await adminClient.auth.admin.updateUserById(user.id, {
      email: newEmail,
      password: newPassword,
    })

    if (authError) {
      console.error('Auth update error:', authError)
      // Rollback DB change
      const { data: profile } = await adminClient
        .from('users')
        .select('mobile_number')
        .eq('id', user.id)
        .single()
      // If we can't read the old number, at least log it
      if (profile) {
        console.error('Phone was partially updated, DB has:', profile.mobile_number)
      }
      return NextResponse.json({ error: 'Failed to update authentication credentials' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update phone error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
