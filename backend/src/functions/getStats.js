/**
 * getStats Azure Function
 * 
 * Endpoint: GET /api/stats
 * Returns:  { total, malicious, safe, avgScore }
 * 
 * The Dashboard page calls this to populate the 4 stat cards at the top.
 */

const { app } = require('@azure/functions')
const { getStats } = require('../shared/db')

app.http('getStats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'stats',

  handler: async (request, context) => {
    context.log('getStats function triggered')

    const stats = await getStats()

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        totalUrlsScanned: stats.total,
        threatsDetected:  stats.malicious,
        safeUrls:         stats.safe,
        averageRiskScore: stats.avgScore,
        timestamp: new Date().toISOString(),
      }),
    }
  },
})