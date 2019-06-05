import { existsSync, readFileSync } from 'fs'

const CONTENT_ROOT = 'content/'

export function loadFile<T>(filename: string): T | undefined {
  const file = `${CONTENT_ROOT}${filename}`
  if (!existsSync(file)) {
    return undefined
  }

  const json = readFileSync(file, 'utf8')
  if (!json) {
    return undefined
  }

  const obj = JSON.parse(json)
  if (!obj) {
    return undefined
  }

  return obj as T
}
