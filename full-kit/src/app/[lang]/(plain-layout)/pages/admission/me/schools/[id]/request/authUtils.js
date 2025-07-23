export function getTokenFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)
  return match ? match[1] : null
}

export function setTokenCookie(token) {
  document.cookie = `token=${token}; path=/;`
}

export function isUserEmpty(user) {
  return (
    !user ||
    !user.id ||
    !user.fullName ||
    !user.email ||
    user.emailVerified === false
  )
}
