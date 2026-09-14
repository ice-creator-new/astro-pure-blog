const OWNER = process.env.AUTHOR_GITHUB_OWNER || 'ice-creator-new'
const REPO = process.env.AUTHOR_GITHUB_REPO || 'astro-pure-blog'
const BRANCH = process.env.AUTHOR_GITHUB_BRANCH || 'main'
const API = 'https://api.github.com'

function token() {
  return (
    process.env.AUTHOR_GITHUB_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN ||
    ''
  )
}

function headers() {
  const t = token()
  if (!t) throw new Error('缺少 GitHub Token（请配置 AUTHOR_GITHUB_TOKEN）')
  return {
    Authorization: `Bearer ${t}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'ice-astro-author-cms'
  }
}

export type GhFile = { path: string; sha: string; content?: string }

export async function getFile(path: string): Promise<GhFile | null> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURI(path)}?ref=${BRANCH}`
  const res = await fetch(url, { headers: headers() })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub get ${path}: ${res.status} ${await res.text()}`)
  const data = await res.json()
  if (Array.isArray(data)) throw new Error(`${path} 是目录`)
  const content = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8')
  return { path: data.path, sha: data.sha, content }
}

export async function putFile(path: string, content: string, message: string, sha?: string) {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURI(path)}`
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch: BRANCH
  }
  if (sha) body.sha = sha
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(`GitHub put ${path}: ${res.status} ${await res.text()}`)
  return res.json()
}

export async function deleteFile(path: string, sha: string, message: string) {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURI(path)}`
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha, branch: BRANCH })
  })
  if (!res.ok) throw new Error(`GitHub delete ${path}: ${res.status} ${await res.text()}`)
  return res.json()
}

export async function listDir(path: string): Promise<{ path: string; type: string; sha: string }[]> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURI(path)}?ref=${BRANCH}`
  const res = await fetch(url, { headers: headers() })
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`GitHub list ${path}: ${res.status} ${await res.text()}`)
  const data = await res.json()
  if (!Array.isArray(data)) return []
  return data.map((x: { path: string; type: string; sha: string }) => ({
    path: x.path,
    type: x.type,
    sha: x.sha
  }))
}

/** Recursively delete every file under a directory (GitHub Contents API has no rmdir). */
export async function deleteTree(dirPath: string, message: string) {
  const entries = await listDir(dirPath)
  for (const ent of entries) {
    if (ent.type === 'dir') {
      await deleteTree(ent.path, message)
    } else if (ent.type === 'file') {
      await deleteFile(ent.path, ent.sha, message)
    }
  }
}

export function githubConfigured() {
  return Boolean(token())
}
