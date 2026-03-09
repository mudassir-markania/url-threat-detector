/**
 * index.js — Function Registry
 * 
 * Azure Functions needs all functions to be imported/registered.
 * This file is the "front desk" that loads all your API endpoints.
 */

require('./scoreUrl')
require('./getRecentThreats')
require('./getStats')

// When you add new functions in the future, require() them here