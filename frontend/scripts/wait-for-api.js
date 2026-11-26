const healthUrl = 'http://127.0.0.1:5175/api/health'
const timeoutMs = 60000
const startedAt = Date.now()
let lastError

while (Date.now() - startedAt < timeoutMs) {
  try {
    const response = await fetch(healthUrl)
    if (response.ok) {
      const health = await response.json()
      if (health.ok) {
        console.log('Rentify API is ready.')
        process.exit(0)
      }
      lastError = new Error('API health check did not report ready')
    } else {
      lastError = new Error(`API health check returned HTTP ${response.status}`)
    }
  } catch (error) {
    lastError = error
  }
  await new Promise(resolve => setTimeout(resolve, 500))
}

console.error(`Rentify API did not become ready at ${healthUrl}: ${lastError?.message || 'timed out'}`)
process.exit(1)
