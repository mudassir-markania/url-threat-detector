/**
 * scoreUrl Azure Function
 * 
 * Endpoint: POST /api/score-url
 * Body:     { "url": "https://example.com" }
 * Returns:  { score, category, flags, isMalicious, url, checkedAt }
 * 
 * This is the most important endpoint — it's what the URL Checker
 * page calls when you click "Scan".
 */

const { app } = require('@azure/functions')
const { scoreUrl } = require('../shared/scorer')
const { saveUrl }  = require('../shared/db')

app.http('scoreUrl', {
  // This function responds to POST requests at /api/score-url
  methods: ['POST'],
  authLevel: 'anonymous',   // no auth needed (we'll add this later if needed)
  route: 'score-url',

  handler: async (request, context) => {
    // context.log is like console.log but goes to Azure's logging system
    context.log('scoreUrl function triggered')

    // ── Step 1: Read the request body ─────────────────────────────
    let body
    try {
      body = await request.json()
    } catch {
      // If body isn't valid JSON, return a 400 (Bad Request) error
      return {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Request body must be valid JSON' }),
      }
    }

    const { url } = body

    // ── Step 2: Validate input ─────────────────────────────────────
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'A valid "url" field is required in the request body' }),
      }
    }

    // ── Step 3: Score the URL using our scoring engine ─────────────
    const result = scoreUrl(url.trim())

    // ── Step 4: Save the result to our database ────────────────────
    const saved = await saveUrl({
      url: url.trim(),
      score: result.score,
      category: result.category,
      flags: result.flags,
      isMalicious: result.isMalicious,
    })

    // ── Step 5: Return the response ────────────────────────────────
    // HTTP 200 = success
    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // CORS headers — allow our React app (running on port 5173) to call this API
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        url: saved.url,
        score: saved.score,
        category: saved.category,
        flags: saved.flags,
        isMalicious: saved.isMalicious,
        checkedAt: saved.checkedAt,
        id: saved.id,
      }),
    }
  },
})