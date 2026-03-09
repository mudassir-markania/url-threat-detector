/**
 * api.js — Centralized API Configuration
 * 
 * All API calls go through this file.
 * This means if your backend URL ever changes, you only update it HERE
 * instead of hunting through every component.
 */

import axios from 'axios'

// When running locally: backend is on port 7071, frontend on 5173
// When deployed: both will use the Azure URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7071/api'

// Create a pre-configured axios instance
// Think of this like a phone that's already dialed to your backend
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,             // give up after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── API methods ──────────────────────────────────────────────────

/**
 * Check a URL for threats
 * @param {string} url - The URL to scan
 */
export const checkUrl = async (url) => {
  const response = await api.post('/score-url', { url })
  return response.data
}

/**
 * Fetch recent threats for the dashboard table
 * @param {number} limit - How many results to return
 * @param {boolean} onlyMalicious - Filter to only threats
 */
export const fetchRecentThreats = async (limit = 10, onlyMalicious = false) => {
  const response = await api.get('/recent-threats', {
    params: { limit, onlyMalicious },
  })
  return response.data
}

/**
 * Fetch summary statistics for the dashboard cards
 */
export const fetchStats = async () => {
  const response = await api.get('/stats')
  return response.data
}

export default api