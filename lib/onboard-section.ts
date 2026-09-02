export const REVIEW_SLUG = 'review'
export const LAST_SECTION_KEY = 'onboard-form-section'

export function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'section'
}

export function categorySlugs(categories: { id: number; name: string }[]): string[] {
  const used = new Set<string>([REVIEW_SLUG])
  return categories.map(cat => {
    const base = slugify(cat.name)
    let slug = base
    if (used.has(slug)) slug = `${base}-${cat.id}`
    let n = 2
    while (used.has(slug)) {
      slug = `${base}-${n}`
      n += 1
    }
    used.add(slug)
    return slug
  })
}

export function sectionHref(slug: string): string {
  return `/onboard/questionnaire/${slug}`
}
