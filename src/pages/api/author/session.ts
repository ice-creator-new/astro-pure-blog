import type { APIRoute } from 'astro'

import { requireAuthor } from '@/lib/author/auth'
import { githubConfigured } from '@/lib/author/github'

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const ok = requireAuthor(request)
  return new Response(
    JSON.stringify({ ok, github: githubConfigured() }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
