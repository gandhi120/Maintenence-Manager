import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createHmac } from 'crypto'

function derivePassword(phone: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET || 'fallback-secret')
    .update(phone)
    .digest('hex')
}

export async function POST(request: Request) {
  try {
    const { phone, token } = await request.json()

    if (!phone) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 })
    }

    console.log('--- Verify OTP: Creating Supabase session ---')
    console.log('Phone:', phone)
    console.log('MSG91 Token:', token ? 'present' : 'missing')

    // Create or sign in user in Supabase
    const adminClient = createAdminClient()
    const email = `${phone.replace(/\+/g, '')}@phone.auth`
    const password = derivePassword(phone)

    // Create Supabase server client with cookie access
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // ignored in server context
            }
          },
        },
      }
    )

    // Try signing in first (existing user)
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInData?.user) {
      console.log('Existing user signed in:', signInData.user.id)

      // Upsert profile (in case user exists in auth but not in users table)
      const { error: upsertError } = await adminClient
        .from('users')
        .upsert({
          id: signInData.user.id,
          mobile_number: phone,
          name: '',
          role: 'manager',
          last_active_at: new Date().toISOString(),
        }, { onConflict: 'id', ignoreDuplicates: false })

      if (upsertError) {
        console.error('Profile upsert error (existing user):', upsertError)
      }

      const { data: profile } = await adminClient
        .from('users')
        .select('role')
        .eq('id', signInData.user.id)
        .single()

      console.log('User profile:', profile)

      return NextResponse.json({
        success: true,
        role: profile?.role || 'manager',
        isNewUser: false,
      })
    }

    // User doesn't exist — create via admin
    console.log('Creating new user with email:', email)
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      phone,
      phone_confirm: true,
      email_confirm: true,
      user_metadata: { phone },
    })

    if (createError) {
      console.error('Create user error:', createError)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    console.log('New user created:', newUser.user.id)

    // Create profile in users table
    const { error: profileError } = await adminClient.from('users').upsert({
      id: newUser.user.id,
      mobile_number: phone,
      name: '',
      role: 'manager',
      last_active_at: new Date().toISOString(),
    }, { onConflict: 'id' })

    if (profileError) {
      console.error('Profile upsert error:', profileError)
    }

    // Sign in the newly created user
    const { data: newSignIn, error: newSignInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (newSignInError) {
      console.error('Sign in new user error:', newSignInError)
      return NextResponse.json({ error: 'Account created but sign-in failed' }, { status: 500 })
    }

    console.log('New user signed in:', newSignIn.user?.id)

    return NextResponse.json({
      success: true,
      role: 'manager',
      isNewUser: true,
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
