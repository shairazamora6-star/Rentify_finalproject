import { mockItems } from '../data/mockData'

export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
  || (import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE !== 'false')

const demoUsersKey = 'rentify_demo_users'
const jsonResponse = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
})

function readStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function getDemoUser(email) {
  const normalizedEmail = email.trim().toLowerCase()
  return readStoredArray(demoUsersKey).find(user => user.email === normalizedEmail)
}

function getRecommendations(message) {
  const terms = message.toLowerCase().match(/[a-z0-9]+/g) || []
  const stopWords = new Set(['a', 'an', 'and', 'for', 'i', 'in', 'is', 'it', 'looking', 'need', 'of', 'or', 'rent', 'the', 'to', 'want', 'with'])
  const keywords = terms.filter(term => !stopWords.has(term))
  const budget = message.match(/(?:under|below|less than)\s*\$?(\d+)/i)
  const maxPrice = budget ? Number(budget[1]) : null
  const matches = mockItems
    .map(item => {
      const searchable = `${item.title} ${item.category} ${item.description}`.toLowerCase()
      return { item, score: keywords.reduce((total, term) => total + Number(searchable.includes(term)), 0) }
    })
    .filter(({ item, score }) => score > 0 && (maxPrice === null || item.price <= maxPrice))
    .sort((a, b) => b.score - a.score || Number(b.item.featured) - Number(a.item.featured))
    .slice(0, 3)
  const items = (matches.length ? matches.map(match => match.item) : mockItems
    .filter(item => maxPrice === null || item.price <= maxPrice)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 3))

  return {
    reply: matches.length
      ? 'Here are a few listings that may fit what you need.'
      : 'I could not find an exact match, but these popular rentals may help.',
    items,
    external: false,
  }
}

async function mockApiFetch(url, options = {}) {
  const requestUrl = new URL(url, window.location.origin)
  const method = (options.method || 'GET').toUpperCase()
  let body = {}
  if (options.body) {
    try {
      body = JSON.parse(options.body)
    } catch {
      return jsonResponse({ error: 'Request body must be valid JSON' }, 400)
    }
  }

  if (requestUrl.pathname === '/api/items' && method === 'GET') {
    return jsonResponse(mockItems)
  }

  if (requestUrl.pathname === '/api/auth/register' && method === 'POST') {
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (!name || !email || typeof body.password !== 'string' || !body.password) {
      return jsonResponse({ error: 'Name, email and password are required' }, 400)
    }
    if (getDemoUser(email)) {
      return jsonResponse({ error: 'An account with this email already exists' }, 409)
    }
    const user = {
      id: Date.now(),
      name,
      email,
      location: 'San Francisco, CA',
      avatar: name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase(),
    }
    localStorage.setItem(demoUsersKey, JSON.stringify([...readStoredArray(demoUsersKey), user]))
    return jsonResponse({ user }, 201)
  }

  if (requestUrl.pathname === '/api/auth/login' && method === 'POST') {
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (!email || typeof body.password !== 'string' || !body.password) {
      return jsonResponse({ error: 'Email and password are required' }, 400)
    }
    const user = getDemoUser(email) || {
      id: Date.now(),
      name: email.split('@')[0].replace(/[._-]+/g, ' '),
      email,
      location: 'San Francisco, CA',
      avatar: email.slice(0, 2).toUpperCase(),
    }
    return jsonResponse({ user })
  }

  if (requestUrl.pathname === '/api/auth/forgot-password' && method === 'POST') {
    return jsonResponse({ message: 'Demo mode: no reset email was sent.' })
  }

  if (requestUrl.pathname === '/api/auth/reset-password' && method === 'POST') {
    return jsonResponse({ message: 'Demo mode: the reset flow was previewed; no password was changed.' })
  }

  if (requestUrl.pathname === '/api/nearby' && method === 'GET') {
    const location = requestUrl.searchParams.get('location')?.trim() || ''
    const normalizedLocation = location.toLowerCase()
    const items = location
      ? mockItems.filter(item => item.location.toLowerCase().includes(normalizedLocation))
      : mockItems
    return jsonResponse({
      location: location || 'your selected location',
      approximate: true,
      items: items.map(item => ({ ...item, approximateDistance: Number.parseFloat(item.distance) || 0 })),
    })
  }

  if (requestUrl.pathname === '/api/assistant/recommendations' && method === 'POST') {
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    if (!message) return jsonResponse({ error: 'Tell us what you are looking to rent' }, 400)
    return jsonResponse(getRecommendations(message))
  }

  if (requestUrl.pathname === '/api/rentals' && method === 'POST') {
    return jsonResponse({ id: Date.now(), status: 'upcoming' }, 201)
  }

  return jsonResponse({ error: 'This action is not available in frontend demo mode.' }, 501)
}

export function apiFetch(url, options) {
  return isDemoMode ? mockApiFetch(url, options) : fetch(url, options)
}
