'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const inputBase = 'w-full px-3 py-2.5 border rounded-lg text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none leading-5'

function LoginContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const notice       = searchParams.get('notice')

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/onboard/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Login failed.')
        return
      }

      router.push('/onboard/form')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-navy-900 mb-1">Welcome Back</h1>
        <p className="text-slate-500 text-sm mb-8">
          Log in to continue your onboarding questionnaire.
        </p>

        {notice === 'already-registered' && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-700 text-sm">
            Your invitation code has already been used. Please log in with your existing account.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoFocus
              className={`${inputBase} border-slate-200`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-navy-800">Password</label>
              <Link
                href="/onboard/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className={`${inputBase} border-slate-200 pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-6">
          Have an invitation code?{' '}
          <Link href="/onboard" className="text-blue-600 hover:underline">
            Start here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-sm">Loading…</div>}>
      <LoginContent />
    </Suspense>
  )
}
