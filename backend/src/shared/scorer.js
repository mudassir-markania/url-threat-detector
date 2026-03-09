/**
 * scorer.js — URL Threat Scoring Engine
 * 
 * This file contains the logic that decides HOW dangerous a URL is.
 * It returns a score from 0 (safe) to 100 (extremely dangerous).
 * 
 * Think of it like a doctor doing a checkup — it checks many symptoms
 * and adds up a risk score based on what it finds.
 */

// ─── Suspicious patterns we look for in URLs ─────────────────────

// TLDs (Top Level Domains) commonly used by attackers
// e.g., .tk, .ml, .ga are free domains — attackers love free stuff
const SUSPICIOUS_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.gq',   // Free domains
  '.ru', '.cn', '.pw', '.top',          // High-abuse country codes
  '.xyz', '.click', '.download',        // Abuse-prone generics
  '.zip', '.mov',                       // Google's controversial TLDs
]

// Words that appear in phishing URLs trying to impersonate brands
const PHISHING_KEYWORDS = [
  'login', 'signin', 'verify', 'account', 'secure',
  'update', 'confirm', 'banking', 'paypal', 'apple',
  'microsoft', 'google', 'amazon', 'netflix', 'bank',
  'password', 'credential', 'wallet', 'crypto',
]

// File extensions that are almost always malware
const MALWARE_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.scr', '.pif',
  '.vbs', '.js', '.jar', '.msi', '.ps1',
  '.dll', '.hta', '.wsf',
]

// Signs the URL is trying to hide itself
const OBFUSCATION_SIGNS = [
  '%20', '%2F', '%3A',   // Excessive URL encoding
  '0x',                   // Hex encoding
]

// ─── Main scoring function ────────────────────────────────────────
/**
 * scoreUrl(url) → returns an object like:
 * {
 *   score: 85,
 *   category: "Phishing",
 *   flags: ["Suspicious TLD", "Contains phishing keyword: 'login'"],
 *   isMalicious: true
 * }
 */
function scoreUrl(url) {
  // Guard: if no URL provided, return early
  if (!url || typeof url !== 'string') {
    return { score: 0, category: 'Unknown', flags: [], isMalicious: false }
  }

  // Normalize: lowercase and trim whitespace
  const normalizedUrl = url.toLowerCase().trim()
  
  let score = 0          // starts at 0 (safe), we ADD risk points
  const flags = []       // list of reasons why it's suspicious

  // ── Check 1: Suspicious TLD ─────────────────────────────────────
  // Does the URL end in a known bad domain extension?
  const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => normalizedUrl.includes(tld))
  if (hasSuspiciousTld) {
    score += 25
    const foundTld = SUSPICIOUS_TLDS.find(tld => normalizedUrl.includes(tld))
    flags.push(`Suspicious TLD: ${foundTld}`)
  }

  // ── Check 2: Phishing keywords ───────────────────────────────────
  // Does the URL contain words used to trick users?
  const foundKeywords = PHISHING_KEYWORDS.filter(kw => normalizedUrl.includes(kw))
  if (foundKeywords.length > 0) {
    score += foundKeywords.length * 12   // each keyword adds 12 points
    score = Math.min(score, 95)          // cap at 95 (100 = confirmed by DB)
    flags.push(`Phishing keywords found: ${foundKeywords.join(', ')}`)
  }

  // ── Check 3: Malware file extensions ────────────────────────────
  const hasMalwareExt = MALWARE_EXTENSIONS.some(ext => normalizedUrl.endsWith(ext))
  if (hasMalwareExt) {
    score += 40
    const foundExt = MALWARE_EXTENSIONS.find(ext => normalizedUrl.endsWith(ext))
    flags.push(`Dangerous file extension: ${foundExt}`)
  }

  // ── Check 4: IP address instead of domain ───────────────────────
  // Attackers often use raw IP addresses to avoid detection
  // This regex matches patterns like http://192.168.1.1/...
  const ipPattern = /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
  if (ipPattern.test(normalizedUrl)) {
    score += 30
    flags.push('URL uses raw IP address instead of domain name')
  }

  // ── Check 5: Excessive subdomains ───────────────────────────────
  // Phishing: secure-paypal.login.verify.evilsite.com
  // Count dots — more than 3 subdomains is very suspicious
  try {
    const hostname = new URL(normalizedUrl).hostname
    const dotCount = (hostname.match(/\./g) || []).length
    if (dotCount > 3) {
      score += 20
      flags.push(`Excessive subdomains detected (${dotCount} levels)`)
    }
  } catch {
    // URL is malformed — that's itself suspicious
    score += 15
    flags.push('URL is malformed or unparseable')
  }

  // ── Check 6: Obfuscation ────────────────────────────────────────
  const hasObfuscation = OBFUSCATION_SIGNS.some(sign => normalizedUrl.includes(sign))
  if (hasObfuscation) {
    score += 15
    flags.push('URL contains obfuscated/encoded characters')
  }

  // ── Check 7: Very long URL ───────────────────────────────────────
  // Phishing URLs are often extremely long to hide the real domain
  if (normalizedUrl.length > 200) {
    score += 10
    flags.push(`Unusually long URL (${normalizedUrl.length} characters)`)
  }

  // ── Check 8: HTTP (not HTTPS) ────────────────────────────────────
  // Legitimate sites almost always use HTTPS nowadays
  if (normalizedUrl.startsWith('http://')) {
    score += 10
    flags.push('Uses insecure HTTP instead of HTTPS')
  }

  // ── Final: cap at 99, decide category ───────────────────────────
  score = Math.min(Math.max(Math.round(score), 0), 99)

  const category = determineCategory(score, flags, normalizedUrl)
  const isMalicious = score >= 50

  return { score, category, flags, isMalicious }
}

// ─── Category decider ────────────────────────────────────────────
function determineCategory(score, flags, url) {
  const flagText = flags.join(' ').toLowerCase()
  
  if (url.match(/\.(exe|bat|cmd|scr|msi|dll)$/)) return 'Malware'
  if (flagText.includes('phishing'))               return 'Phishing'
  if (flagText.includes('ip address'))             return 'Suspicious'
  if (score >= 80)                                 return 'High Risk'
  if (score >= 50)                                 return 'Suspicious'
  return 'Clean'
}

// Export the function so other files can use it
module.exports = { scoreUrl }