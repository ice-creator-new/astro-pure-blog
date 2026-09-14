import type { APIRoute } from 'astro'

import { requireAuthor } from '@/lib/author/auth'
import { deleteTree, getFile, putFile } from '@/lib/author/github'
import { buildMarkdown, parseMarkdown, type PostMeta } from '@/lib/author/markdown'

export const prerender = false

const POST_ROOT = 'src/content/post'

export const GET: APIRoute = async ({ request, params }) => {
  if (!requireAuthor(request)) {
    return new Response(JSON.stringify({ ok: false, error: '未登录' }), { status: 401 })
  }
  const slug = params.slug
  if (!slug) return new Response(JSON.stringify({ ok: false, error: '缺 slug' }), { status: 400 })
  try {
    const file = await getFile(`${POST_ROOT}/${slug}/index.md`)
    if (!file?.content) {
      return new Response(JSON.stringify({ ok: false, error: '未找到' }), { status: 404 })
    }
    const parsed = parseMarkdown(file.content)
    return new Response(
      JSON.stringify({ ok: true, slug, sha: file.sha, ...parsed }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 })
  }
}

export const PUT: APIRoute = async ({ request, params }) => {
  if (!requireAuthor(request)) {
    return new Response(JSON.stringify({ ok: false, error: '未登录' }), { status: 401 })
  }
  const slug = params.slug
  if (!slug) return new Response(JSON.stringify({ ok: false, error: '缺 slug' }), { status: 400 })
  try {
    const path = `${POST_ROOT}/${slug}/index.md`
    const existing = await getFile(path)
    if (!existing) {
      return new Response(JSON.stringify({ ok: false, error: '未找到' }), { status: 404 })
    }
    const body = await request.json()
    const meta: PostMeta = {
      title: String(body.title || '未命名').slice(0, 60),
      titleEn: body.titleEn ? String(body.titleEn).slice(0, 80) : undefined,
      description: String(body.description || '暂无描述，请补充。').slice(0, 180),
      descriptionEn: body.descriptionEn ? String(body.descriptionEn).slice(0, 180) : undefined,
      publishDate:
        String(body.publishDate || '').trim() ||
        new Date().toISOString().slice(0, 16).replace('T', ' '),
      updatedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      tags: Array.isArray(body.tags)
        ? body.tags.map(String)
        : String(body.tags || '')
            .split(/[,，]/)
            .map((s) => s.trim())
            .filter(Boolean),
      language: body.language ? String(body.language) : '中 / EN',
      draft: Boolean(body.draft)
    }
    if (meta.description.length < 10) meta.description = meta.description + '………'
    const md = buildMarkdown(meta, String(body.body || ''))
    const put = await putFile(path, md, `author: update post ${slug}`, existing.sha)
    const commitSha = put?.commit?.sha
    const commitUrl = put?.commit?.html_url
    return new Response(JSON.stringify({ ok: true, slug, commitSha, commitUrl }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 })
  }
}

export const DELETE: APIRoute = async ({ request, params }) => {
  if (!requireAuthor(request)) {
    return new Response(JSON.stringify({ ok: false, error: '未登录' }), { status: 401 })
  }
  const slug = params.slug
  if (!slug) return new Response(JSON.stringify({ ok: false, error: '缺 slug' }), { status: 400 })
  try {
    await deleteTree(`${POST_ROOT}/${slug}`, `author: delete post ${slug}`)
    return new Response(JSON.stringify({ ok: true, slug }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 })
  }
}
