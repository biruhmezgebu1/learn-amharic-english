import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return NextResponse.json({ text: 'API key not configured.' }, { status: 200 })

  try {
    const { system, messages } = await request.json()
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 200, system: system || '', messages }),
    })
    const data = await res.json()
    const text = data.content?.[0]?.text || 'Sorry, I could not respond.'
    return NextResponse.json({ text })
  } catch {
    return NextResponse.json({ text: 'Connection error.' }, { status: 200 })
  }
}
