import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { isValidEmail } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // TODO: In production, send an email or create a support ticket.
    logger.info('[Contact] Form submission received', { subject, name, email })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to process contact form.' }, { status: 500 })
  }
}
