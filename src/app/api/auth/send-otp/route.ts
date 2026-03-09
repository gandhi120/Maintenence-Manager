import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    // Format: remove + prefix, MSG91 expects country code + number (e.g. 919876543210)
    const mobile = phone.startsWith('+') ? phone.slice(1) : phone

    const url = `https://control.msg91.com/api/v5/otp?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=${mobile}`

    console.log('--- MSG91 Send OTP ---')
    console.log('URL:', url)
    console.log('Auth Key:', process.env.MSG91_AUTH_TOKEN?.slice(0, 10) + '...')
    console.log('Template ID:', process.env.MSG91_TEMPLATE_ID)
    console.log('Mobile:', mobile)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'authkey': process.env.MSG91_AUTH_TOKEN!,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    console.log('MSG91 Response Status:', response.status)
    console.log('MSG91 Response Body:', JSON.stringify(data))

    if (data.type === 'error') {
      return NextResponse.json({ error: data.message || 'Failed to send OTP' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      requestId: data.request_id,
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
