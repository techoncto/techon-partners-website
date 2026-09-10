'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8)              score++
  if (pw.length >= 12)             score++
  if (/[A-Z]/.test(pw))           score++
  if (/[0-9]/.test(pw))           score++
  if (/[^A-Za-z0-9]/.test(pw))   score++
  if (score <= 1) return { score, label: 'Weak',        color: 'bg-red-400' }
  if (score <= 2) return { score, label: 'Fair',        color: 'bg-amber-400' }
  if (score <= 3) return { score, label: 'Good',        color: 'bg-yellow-400' }
  if (score <= 4) return { score, label: 'Strong',      color: 'bg-emerald-400' }
  return              { score, label: 'Very Strong', color: 'bg-green-500' }
}

const inputBase = 'w-full px-3 py-2.5 border rounded-lg text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none leading-5'

function ResetPasswordContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const token        = searchParams.get('token') ?? ''

  const [password, setPassword]           = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword]   = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [touched, setTouched]             = useState<Record<string, boolean>>({})
  const [error, setError]                 = useState('')
  const [loading, setLoading]             = useState(false)
  const [success, setSuccess]             = useState(false)

  const pwStrength = passwordStrength(password)

  const errors = {
    password: touched.password && password.length > 0 && password.length < 8
      ? 'Password must be at least 8 characters.' : '',
    passwordReq: touched.password && !password ? 'Password is required.' : '',
    confirm: touched.confirm && confirmPassword && password !== confirmPassword
      ? 'Passwords do not match.' : '',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ password: true, confirm: true })
    setError('')

    if (!password || password.length < 8 || password !== confirmPassword) return

    if (!token) {
      setError('Invalid reset link. Please request a new one.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/onboard/reset-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
      setSuccess(true)
      setTimeout(() => router.push('/onboard/login'), 3000)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <p className="text-red-600 text-sm mb-4">Invalid or missing reset link.</p>
          <Link href="/onboard/forgot-password" className="text-blue-600 text-sm hover:underline">
            Request a new one
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

        {success ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-navy-900 mb-2">Password Updated</h1>
            <p className="text-slate-500 text-sm">
              Your password has been changed. Redirecting you to Log In…
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-navy-900 mb-1">Reset Password</h1>
            <p className="text-slate-500 text-sm mb-8">Enter a new password for your account.</p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* New password */}
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5">
                  New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, password: true }))}
                    autoFocus
                    className={`${inputBase} pr-12 ${(errors.password || errors.passwordReq) ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {(errors.passwordReq || errors.password) && (
                  <p className="text-red-500 text-xs mt-1">{errors.passwordReq || errors.password}</p>
                )}

                {/* Strength meter */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength.score ? pwStrength.color : 'bg-slate-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">{pwStrength.label}</p>
                  </div>
                )}

                {touched.password && (
                  <ul className="mt-2 space-y-0.5">
                    {[
                      { ok: password.length >= 8,           label: 'At least 8 characters' },
                      { ok: /[A-Z]/.test(password),         label: 'One uppercase letter' },
                      { ok: /[0-9]/.test(password),         label: 'One number' },
                      { ok: /[^A-Za-z0-9]/.test(password),  label: 'One special character' },
                    ].map(r => (
                      <li key={r.label} className={`text-xs flex items-center gap-1.5 ${r.ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <span>{r.ok ? '✓' : '○'}</span>{r.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, confirm: true }))}
                    className={`${inputBase} pr-12 ${errors.confirm ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
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
                {loading ? 'Saving…' : 'Set New Password'}
              </button>
            </form>

            <p className="text-center text-slate-400 text-xs mt-6">
              <Link href="/onboard/login" className="text-blue-600 hover:underline">
                ← Back to Log In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-sm">Loading…</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
