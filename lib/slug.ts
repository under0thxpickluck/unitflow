export function createSlug(fields: {
  brand: string
  model: string
  socket?: string
  category: string
}): string {
  return [fields.brand, fields.model, fields.socket, fields.category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
