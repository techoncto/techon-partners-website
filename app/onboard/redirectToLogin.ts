export async function redirectToOnboardLogin() {
  try {
    await fetch('/api/onboard/logout', { method: 'POST', credentials: 'include' })
  } catch {
    // Cookie may already be missing; still send them to login.
  }
  window.location.replace('/onboard/login')
}
