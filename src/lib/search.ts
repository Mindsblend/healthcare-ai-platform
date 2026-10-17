export function normalizeSearchText(input: string) {
  return input
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[\u200c\u200f\u200e]/g, ' ') // نیم‌فاصله و کاراکترهای جهت
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function getSearchTokens(query: string) {
  return normalizeSearchText(query).split(' ').filter(Boolean)
}

export function matchesQuery(title: string | null | undefined, query: string) {
  const tokens = getSearchTokens(query)
  if (tokens.length === 0) return true

  const normalizedTitle = normalizeSearchText(title ?? '')
  return tokens.every((token) => normalizedTitle.includes(token))
}
