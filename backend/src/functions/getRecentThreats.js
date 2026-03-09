/**
 * getRecentThreats Azure Function
 * 
 * Endpoint: GET /api/recent-threats
 * Query params: ?limit=10&onlyMalicious=true
 * Returns:  Array of recent URL scan results
 * 
 * The Dashboard page calls this to populate the "Recent Threats" table.
 */

const { app } = require('@azure/functions')
const { getRecentUrls } = require('../shared/db')

app.http('getRecentThreats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'recent-threats',

  handler: async (request, context) => {
    context.log('getRecentThreats function triggered')

    // Read optional query parameters from the URL
    // e.g., /api/recent-threats?limit=5&onlyMalicious=true
    const limit         = parseInt(request.query.get('limit') || '10')
    const onlyMalicious = request.query.get('onlyMalicious') === 'true'

    // Validate limit — must be a number between 1 and 100
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'limit must be a number between 1 and 100' }),
      }
    }

    // Fetch from database
    const threats = await getRecentUrls(limit, onlyMalicious)

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        data: threats,
        count: threats.length,
        timestamp: new Date().toISOString(),
      }),
    }
  },
})