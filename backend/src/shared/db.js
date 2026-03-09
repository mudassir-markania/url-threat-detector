/**
 * db.js — Database Connection Helper
 * 
 * This file handles connecting to Azure Cosmos DB.
 * We'll fully activate it in Phase 3 when we create the database.
 * 
 * For now, it uses an IN-MEMORY store (a plain JS array) so
 * the API works locally without needing a real database yet.
 * 
 * Think of this like a mock database — training wheels
 * that we'll swap out for the real thing in Phase 3.
 */

require('dotenv').config()

// ─── IN-MEMORY store (Phase 2 placeholder) ───────────────────────
// This is just a JavaScript array that acts like a database.
// Data disappears when the server restarts — that's fine for now.
let urlStore = [
  {
    id: '1',
    url: 'malware-download.ru/payload.exe',
    score: 97,
    category: 'Malware',
    flags: ['Suspicious TLD: .ru', 'Dangerous file extension: .exe'],
    isMalicious: true,
    checkedAt: new Date(Date.now() - 2 * 60000).toISOString(),    // 2 min ago
  },
  {
    id: '2',
    url: 'secure-paypal-login.phishsite.com',
    score: 94,
    category: 'Phishing',
    flags: ['Phishing keywords found: secure, paypal, login'],
    isMalicious: true,
    checkedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '3',
    url: 'free-iphone-winner.click',
    score: 88,
    category: 'Suspicious',
    flags: ['Suspicious TLD: .click'],
    isMalicious: true,
    checkedAt: new Date(Date.now() - 11 * 60000).toISOString(),
  },
  {
    id: '4',
    url: 'cryptominer-js.net/mine.js',
    score: 82,
    category: 'Malware',
    flags: ['Phishing keywords found: crypto', 'Dangerous file extension: .js'],
    isMalicious: true,
    checkedAt: new Date(Date.now() - 18 * 60000).toISOString(),
  },
  {
    id: '5',
    url: 'github.com',
    score: 2,
    category: 'Clean',
    flags: [],
    isMalicious: false,
    checkedAt: new Date(Date.now() - 25 * 60000).toISOString(),
  },
]

// ─── DB Operations ────────────────────────────────────────────────

/**
 * saveUrl — saves a scanned URL result to the store
 * In Phase 3 this will write to Cosmos DB
 */
async function saveUrl(urlData) {
  const record = {
    id: Date.now().toString(),   // unique ID using timestamp
    ...urlData,
    checkedAt: new Date().toISOString(),
  }
  urlStore.unshift(record)       // add to front (newest first)
  
  // Keep only last 100 records in memory
  if (urlStore.length > 100) urlStore = urlStore.slice(0, 100)
  
  return record
}

/**
 * getRecentUrls — returns the N most recent scanned URLs
 * Optionally filter to only malicious ones
 */
async function getRecentUrls(limit = 10, onlyMalicious = false) {
  let results = [...urlStore]
  if (onlyMalicious) results = results.filter(u => u.isMalicious)
  return results.slice(0, limit)
}

/**
 * getStats — returns summary statistics for the dashboard
 */
async function getStats() {
  const total     = urlStore.length
  const malicious = urlStore.filter(u => u.isMalicious).length
  const safe      = total - malicious
  const avgScore  = total > 0
    ? Math.round(urlStore.reduce((sum, u) => sum + u.score, 0) / total)
    : 0

  return { total, malicious, safe, avgScore }
}

module.exports = { saveUrl, getRecentUrls, getStats }