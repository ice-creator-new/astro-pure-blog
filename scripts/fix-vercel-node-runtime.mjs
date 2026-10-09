import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const TARGET = 'nodejs22.x'
const ROOT = '.vercel/output'

async function walk(dir) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(path)
      continue
    }
    if (entry.name !== '.vc-config.json') continue
    const raw = await readFile(path, 'utf8')
    const config = JSON.parse(raw)
    if (config.runtime === 'nodejs18.x' || config.runtime === 'nodejs20.x') {
      const prev = config.runtime
      config.runtime = TARGET
      await writeFile(path, `${JSON.stringify(config, null, 2)}\n`)
      console.log(`patched ${path}: ${prev} -> ${TARGET}`)
    }
  }
}

await walk(ROOT)
