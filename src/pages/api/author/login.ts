import type { APIRoute } from 'astro'

import { createSessionToken, SESSION_COOKIE, verifyPassword } from '@/lib/author/auth'

export const prerender = false

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json()
    const password = String(body?.password ?? '')
    if (!verifyPassword(password)) {
      return new Response(JSON.stringify({ ok: false, error: '密码错误' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    const token = createSessionToken()
    cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12
    })
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
