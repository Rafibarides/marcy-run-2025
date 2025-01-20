export const getAssetPath = (path) => {
  const base = import.meta.env.BASE_URL
  return `${base}${path.startsWith('/') ? path.slice(1) : path}`
} 