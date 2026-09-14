import type { MarkdownHeading } from 'astro'

export type LangHeading = MarkdownHeading & { lang?: 'zh' | 'en' }

/**
 * Tag headings with zh/en when the post body uses data-post-lang blocks.
 * Matches by heading text (Astro heading count can differ from raw ## lines
 * when samples include ### inside fences).
 */
export function tagHeadingsByLang(body: string, headings: MarkdownHeading[]): LangHeading[] {
  if (!/data-post-lang\s*=\s*["'](?:zh|en)["']/.test(body)) {
    return headings.map((h) => ({ ...h }))
  }

  let lang: 'zh' | 'en' = 'zh'
  let inFence = false
  const textLang = new Map<string, 'zh' | 'en'>()

  for (const line of body.split(/\r?\n/)) {
    if (/^```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const langOpen = line.match(/data-post-lang=["'](zh|en)["']/)
    if (langOpen) {
      lang = langOpen[1] as 'zh' | 'en'
      continue
    }

    const hm = line.match(/^#{2,6}\s+(.+)$/)
    if (hm) {
      const text = hm[1].trim()
      // First occurrence wins (zh block comes first in our posts).
      if (!textLang.has(text)) textLang.set(text, lang)
    }
  }

  return headings.map((h) => {
    const langForText = textLang.get(h.text.trim())
    return langForText ? { ...h, lang: langForText } : { ...h }
  })
}
