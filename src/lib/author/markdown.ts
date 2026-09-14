export type PostMeta = {
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  publishDate: string
  updatedDate?: string
  tags: string[]
  language?: string
  draft?: boolean
  heroImage?: { src: string; alt?: string; color?: string }
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || `post-${Date.now()}`
}

function yamlEscape(s: string) {
  if (/[:#\[\]{},&*?|>!%@`]/.test(s) || s.includes('\n') || s.includes('"')) {
    return JSON.stringify(s)
  }
  return s
}

export function buildMarkdown(meta: PostMeta, body: string): string {
  const lines = ['---']
  lines.push(`title: ${yamlEscape(meta.title)}`)
  if (meta.titleEn) lines.push(`titleEn: ${yamlEscape(meta.titleEn)}`)
  lines.push(`publishDate: ${JSON.stringify(meta.publishDate)}`)
  if (meta.updatedDate) lines.push(`updatedDate: ${JSON.stringify(meta.updatedDate)}`)
  lines.push(`description: ${yamlEscape(meta.description)}`)
  if (meta.descriptionEn) lines.push(`descriptionEn: ${yamlEscape(meta.descriptionEn)}`)
  if (meta.tags?.length) {
    lines.push('tags:')
    for (const t of meta.tags) lines.push(`  - ${yamlEscape(t)}`)
  } else {
    lines.push('tags: []')
  }
  if (meta.language) lines.push(`language: ${yamlEscape(meta.language)}`)
  lines.push(`draft: ${meta.draft ? 'true' : 'false'}`)
  if (meta.heroImage?.src) {
    lines.push('heroImage:')
    lines.push(`  src: ${yamlEscape(meta.heroImage.src)}`)
    if (meta.heroImage.alt) lines.push(`  alt: ${yamlEscape(meta.heroImage.alt)}`)
    if (meta.heroImage.color) lines.push(`  color: ${yamlEscape(meta.heroImage.color)}`)
  }
  lines.push('---')
  lines.push('')
  lines.push(body.replace(/^\uFEFF/, '').replace(/^\n+/, ''))
  if (!lines[lines.length - 1].endsWith('\n')) {
    /* ensure trailing newline */
  }
  return lines.join('\n') + '\n'
}

export function parseMarkdown(raw: string): { meta: PostMeta; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!m) {
    return {
      meta: {
        title: '未命名',
        description: '暂无描述………',
        publishDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
        tags: []
      },
      body: raw
    }
  }
  const fm = m[1]
  const body = m[2]
  const get = (key: string) => {
    const re = new RegExp(`^${key}:\\s*(.*)$`, 'm')
    const hit = fm.match(re)
    if (!hit) return undefined
    let v = hit[1].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      try {
        v = JSON.parse(v.replace(/^'/, '"').replace(/'$/, '"'))
      } catch {
        v = v.slice(1, -1)
      }
    }
    return v
  }
  const tags: string[] = []
  const tagBlock = fm.match(/^tags:\n((?:  - .*\n?)*)/m)
  if (tagBlock) {
    for (const line of tagBlock[1].split('\n')) {
      const tm = line.match(/^\s*-\s*(.*)$/)
      if (tm) {
        let v = tm[1].trim()
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1)
        }
        if (v) tags.push(v)
      }
    }
  }
  const description = get('description') || '暂无描述………'
  return {
    meta: {
      title: get('title') || '未命名',
      titleEn: get('titleEn'),
      description: description.length >= 10 ? description : description + '……',
      descriptionEn: get('descriptionEn'),
      publishDate: get('publishDate') || new Date().toISOString().slice(0, 16).replace('T', ' '),
      updatedDate: get('updatedDate'),
      tags,
      language: get('language'),
      draft: get('draft') === 'true'
    },
    body: body.replace(/^\n/, '')
  }
}
