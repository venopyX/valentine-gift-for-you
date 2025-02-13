export const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

export const sanitizeInput = (input) => {
  if (!input) return ''
  // Basic XSS prevention
  return input.replace(/[<>]/g, '')
}

export const validateDate = (dateString) => {
  if (!dateString) return false
  const date = new Date(dateString)
  const now = new Date()
  return date instanceof Date && !isNaN(date) && date <= now
}
