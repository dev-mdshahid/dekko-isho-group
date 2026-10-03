export function newsDateToIso(date: string) {
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10)
}

export function newsDateToYear(date: string) {
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.getFullYear()
}
