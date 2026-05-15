const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_MAX_LENGTH = 254

export function isValidEmail(email: unknown): email is string {
  return (
    typeof email === 'string' &&
    email.length > 0 &&
    email.length <= EMAIL_MAX_LENGTH &&
    EMAIL_REGEX.test(email)
  )
}
