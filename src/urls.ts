/** Resolve a file in public/ under Vite's configured deployment base. */
export function publicAssetUrl(path: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path

  const base = import.meta.env.BASE_URL || '/'
  if (base !== '/' && path.startsWith(base)) return path

  return `${base.replace(/\/?$/, '/')}${path.replace(/^\/+/, '')}`
}
