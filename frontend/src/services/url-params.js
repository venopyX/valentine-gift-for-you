import Cookies from 'js-cookie'

/**
 * Parses URL parameters from the current window location.
 * @returns {Object} An object with key-value pairs of URL parameters.
 */
export function parseUrlParams() {
  const params = {}
  const query = new URLSearchParams(window.location.search)
  
  // Parse name
  const name = query.get('name')
  if (name) {
    params.name = decodeURIComponent(name)
  }

  // Parse memories
  const memories = query.get('memories')
  if (memories) {
    try {
      params.memories = decodeURIComponent(memories)
        .split('|')
        .map(memory => {
          const [text, date] = memory.split('@')
          return {
            text: text || '',
            date: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : ''
          }
        })
        .filter(memory => memory.text.trim())
    } catch (e) {
      console.error('Error parsing memories:', e)
      params.memories = []
    }
  } else {
    params.memories = []
  }

  return params
}

/**
 * Stores the given parameters as cookies.
 * @param {Object} params - The parameters to store as cookies.
 * @param {Object} [options={ expires: 7, path: '/' }] - Optional settings for cookie storage.
 */
export function storeParamsAsCookies(params, options = { expires: 7, path: '/' }) {
  Object.keys(params).forEach(key => {
    Cookies.set(key, params[key], options)
  })
}

/**
 * Parses URL parameters and stores them as cookies.
 * @param {Object} [options] - Optional settings for cookie storage.
 * @returns {Object} The parsed parameters.
 */
export function parseAndStoreParams(options) {
  const params = parseUrlParams()
  storeParamsAsCookies(params, options)
  return params
}
