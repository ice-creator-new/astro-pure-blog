import type { APIRoute } from 'astro'

import { requireAuthor } from '@/lib/author/auth'
import { getFile, listDir, putFile } from '@/lib/author/github'
import { buildMarkdown, parseMarkdown, slugify, type PostMeta } from '@/lib/author/markdown'

export const prerender = false

const POST_ROOT = 'src/content/post'

export const GET: APIRoute = async ({ request }) => {
  if (!requireAuthor(request)) {
    return new Response(JSON.stringify({ ok: false, error: '未登录' }), { status: 401 })
  }
  try {
    const dirs = await listDir(POST_ROOT)
    const posts = []
    for (const d of dirs.filter((x) => x.type === 'dir')) {
      const slug = d.path.split('/').pop() || d.path
      const file = await getFile(`${d.path}/index.md`)
      if (!file?.content) continue
      const { meta } = parseMarkdown(file.content)
      posts.push({
        slug,
        title: meta.title,
        titleEn: meta.titleEn || '',
        description: meta.description,
        publishDate: meta.publishDate,
        draft: Boolean(meta.draft),
        tags: meta.tags || []
      })
    }
    posts.sort((a, b) => String(b.publishDate).localeCompare(String(a.publishDate)))
    return new Response(JSON.stringify({ ok: true, posts }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 })
  }
}

export const POST: APIRoute = async ({ request }) => {
  if (!requireAuthor(request)) {
    return new Response(JSON.stringify({ ok: false, error: '未登录' }), { status: 401 })
  }
  try {
    const body = await request.json()
    const slug = slugify(String(body.slug || body.title || ''))
    if (!/^[a-z0-9\u4e00-\u9fff-]+$/i.test(slug)) {
      return new Response(JSON.stringify({ ok: false, error: 'slug 不合法' }), { status: 400 })
    }
    const path = `${POST_ROOT}/${slug}/index.md`
    const existing = await getFile(path)
    if (existing) {
      return new Response(JSON.stringify({ ok: false, error: 'slug 已存在' }), { status: 409 })
    }
    const meta: PostMeta = {
      title: String(body.title || '未命名').slice(0, 60),
      titleEn: body.titleEn ? String(body.titleEn).slice(0, 80) : undefined,
      description: String(body.description || '暂无描述，请补充。').slice(0, 180),
      descriptionEn: body.descriptionEn ? String(body.descriptionEn).slice(0, 180) : undefined,
      publishDate:
        String(body.publishDate || '').trim() ||
        new Date().toISOString().slice(0, 16).replace('T', ' '),
      tags: Array.isArray(body.tags)
        ? body.tags.map(String)
        : String(body.tags || '')
            .split(/[,，]/)
            .map((s) => s.trim())
            .filter(Boolean),
      language: body.language ? String(body.language) : '中 / EN',
      draft: Boolean(body.draft),
      heroImage: body.heroImage?.src
        ? {
            src: String(body.heroImage.src),
            alt: body.heroImage.alt ? String(body.heroImage.alt) : undefined,
            color: body.heroImage.color ? String(body.heroImage.color) : undefined
          }
        : undefined
    }
    if (meta.description.length < 10) meta.description = meta.description + '………'
    const md = buildMarkdown(meta, String(body.body || ''))
    const put = await putFile(path, md, `author: create post ${slug}`)
    const commitSha = put?.commit?.sha
    const commitUrl = put?.commit?.html_url
    return new Response(JSON.stringify({ ok: true, slug, path, commitSha, commitUrl }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 })
  }
}
