export function formatDateISO(date) {
  if (!date) return ''
  return new Date(date).toISOString()
}

export default { formatDateISO }
