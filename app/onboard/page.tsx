'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { US_STATES, CA_PROVINCES, COUNTRIES } from '@/lib/geo'
import { useGooglePlaces } from '@/lib/useGooglePlaces'

// ── Password strength ──────────────────────────────────────────

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: 'Weak',   color: 'bg-red-400' }
  if (score <= 2) return { score, label: 'Fair',   color: 'bg-amber-400' }
  if (score <= 3) return { score, label: 'Good',   color: 'bg-yellow-400' }
  if (score <= 4) return { score, label: 'Strong', color: 'bg-emerald-400' }
  return              { score, label: 'Very Strong', color: 'bg-green-500' }
}

// ── Field helpers ──────────────────────────────────────────────

const inputBase = 'w-full px-3 py-2.5 border rounded-lg text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none leading-5'
const selectBase = `${inputBase} bg-white bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7280'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem] pr-10`
const inputOk  = 'border-slate-200'
const inputErr = 'border-red-400 bg-red-50'

function FieldError({ msg }: { msg: string }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null
}

type Step = 'verify' | 'register'

function OnboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState<Step>('verify')
  const [validatedCode, setValidatedCode] = useState<string | null>(null)

  // Verify form
  const [code, setCode] = useState(searchParams.get('code') ?? '')
  const [email, setEmail] = useState('')
  const [verifyError, setVerifyError] = useState('')
  const [verifying, setVerifying] = useState(false)

  // Register form
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [address, setAddress] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('US')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const places = useGooglePlaces(step === 'register')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handlePlaceSelect = useCallback(async (placeId: string, description: string) => {
    setShowSuggestions(false)
    places.setQuery(description)
    const parsed = await places.selectPlace(placeId)
    if (!parsed) return
    setAddress(parsed.address)
    setAddress2(parsed.address2)
    setCity(parsed.city)
    setState(parsed.state)
    setZip(parsed.zip)
    setCountry(parsed.country)
    setTouched(t => ({ ...t, address: true, city: true, state: true, zip: true }))
    places.clear()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [registerError, setRegisterError] = useState('')
  const [registering, setRegistering] = useState(false)

  function touch(field: string) {
    setTouched(t => ({ ...t, [field]: true }))
  }

  // Per-field validation
  const errors = {
    firstName:  touched.firstName  && !firstName.trim()           ? 'First name is required.' : '',
    lastName:   touched.lastName   && !lastName.trim()            ? 'Last name is required.'  : '',
    phone:      touched.phone      && !phone.trim() ? 'Phone number is required.' : touched.phone && !/^[\d\s\-()+.]{7,20}$/.test(phone) ? 'Enter a valid phone number.' : '',
    address:    touched.address    && !address.trim()             ? 'Street address is required.' : '',
    city:       touched.city       && !city.trim()                ? 'City is required.' : '',
    state:      touched.state      && (country === 'US' || country === 'CA') && !state ? 'Please select a state / province.' : '',
    companyName: touched.companyName && !companyName.trim()        ? 'Company name is required.' : '',
    zip:        touched.zip        && !zip.trim()                 ? 'ZIP / Postal code is required.' : '',
    password:   touched.password   && password.length > 0 && password.length < 8 ? 'Password must be at least 8 characters.' : '',
    passwordReq: touched.password  && !password                  ? 'Password is required.' : '',
    confirm:    touched.confirm    && confirmPassword && password !== confirmPassword ? 'Passwords do not match.' : '',
  }

  const pwStrength = passwordStrength(password)

  // Auto-verify if code is pre-filled from URL (still need email)
  useEffect(() => {
    if (searchParams.get('code')) {
      setCode(searchParams.get('code')!.toUpperCase())
    }
  }, [searchParams])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setVerifyError('')
    setVerifying(true)

    try {
      const res = await fetch('/api/onboard/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase(), email: email.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setVerifyError(data.error ?? 'Verification failed.')
        return
      }

      setValidatedCode(data.code)
      setStep('register')
    } finally {
      setVerifying(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegisterError('')

    // Touch all required fields to surface any errors
    setTouched({ firstName: true, lastName: true, companyName: true, phone: true, address: true, city: true, state: true, zip: true, password: true, confirm: true })

    if (!firstName.trim() || !lastName.trim() || !companyName.trim() || !phone.trim() || !address.trim() || !city.trim() || !zip.trim()) {
      setRegisterError('Please fill in all required fields.')
      return
    }
    if ((country === 'US' || country === 'CA') && !state) {
      setRegisterError('Please select a state or province.')
      return
    }
    if (!/^[\d\s\-()+.]{7,20}$/.test(phone)) {
      setRegisterError('Please enter a valid phone number.')
      return
    }
    if (!password) {
      setRegisterError('Password is required.')
      return
    }
    if (password.length < 8) {
      setRegisterError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match.')
      return
    }

    setRegistering(true)
    try {
      const res = await fetch('/api/onboard/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: validatedCode, firstName, lastName, email, phone, companyName, address, address2, city, state, zip, country, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setRegisterError(data.error ?? 'Registration failed.')
        return
      }

      router.push('/onboard/home')
    } finally {
      setRegistering(false)
    }
  }

  if (step === 'verify') {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-navy-900 mb-1">Welcome</h1>
          <p className="text-slate-500 text-sm mb-8">
            Enter your invitation code and email address to begin the onboarding process.
          </p>

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">
                Invitation Code
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. X7K2M9QP"
                required
                maxLength={8}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-navy-900 text-sm font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {verifyError && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {verifyError}
              </p>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
            >
              {verifying ? 'Verifying…' : 'Continue'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-xs mt-6">
            Already have an account?{' '}
            <a href="/onboard/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-8">
          <button
            onClick={() => setStep('verify')}
            className="text-blue-600 text-sm hover:underline mb-4 flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-navy-900 mb-1">Create Your Account</h1>
          <p className="text-slate-500 text-sm">
            Fill in your details to get started. You can update this information later and complete each section at your own pace.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5" noValidate>

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">First Name <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                onBlur={() => touch('firstName')}
                className={`${inputBase} ${errors.firstName ? inputErr : inputOk}`}
              />
              <FieldError msg={errors.firstName} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Last Name <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                onBlur={() => touch('lastName')}
                className={`${inputBase} ${errors.lastName ? inputErr : inputOk}`}
              />
              <FieldError msg={errors.lastName} />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              readOnly
              className={`${inputBase} ${inputOk} text-slate-500 bg-slate-50 cursor-not-allowed`}
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">Company Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              onBlur={() => touch('companyName')}
              className={`${inputBase} ${errors.companyName ? inputErr : inputOk}`}
            />
            <FieldError msg={errors.companyName} />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onBlur={() => touch('phone')}
              className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
            />
            <FieldError msg={errors.phone} />
          </div>

          {/* Address */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Address</p>
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">
                Street Address <span className="text-red-400">*</span>
                <span className="text-slate-400 font-normal text-xs ml-1">— start typing to search</span>
              </label>
              <div className="google-places-container">
                <input
                  type="text"
                  autoComplete="off"
                  value={address || places.query}
                  onChange={e => {
                    if (address) { setAddress(''); places.clear() }
                    places.setQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => places.suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  onKeyDown={e => { if (e.key === 'Escape') setShowSuggestions(false) }}
                  placeholder=""
                  className={`${inputBase} ${errors.address ? inputErr : inputOk}`}
                />
                {showSuggestions && places.suggestions.length > 0 && (
                  <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {places.suggestions.map(s => (
                      <li
                        key={s.placeId}
                        onMouseDown={() => handlePlaceSelect(s.placeId, s.description)}
                        className="px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer"
                      >
                        {s.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <FieldError msg={errors.address} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Address Line 2 <span className="text-slate-400 font-normal">(optional)</span></label>
              <input
                type="text"
                value={address2}
                onChange={e => setAddress2(e.target.value)}
                className={`${inputBase} ${inputOk}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5">City <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  onBlur={() => touch('city')}
                  className={`${inputBase} ${errors.city ? inputErr : inputOk}`}
                />
                <FieldError msg={errors.city} />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5">
                  {country === 'CA' ? 'Province' : 'State'}{(country === 'US' || country === 'CA') && <span className="text-red-400"> *</span>}
                </label>
                {country === 'US' ? (
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    onBlur={() => touch('state')}
                    className={`${selectBase} ${errors.state ? inputErr : inputOk}`}
                  >
                    <option value="">— Select —</option>
                    {US_STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                ) : country === 'CA' ? (
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    onBlur={() => touch('state')}
                    className={`${selectBase} ${errors.state ? inputErr : inputOk}`}
                  >
                    <option value="">— Select —</option>
                    {CA_PROVINCES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className={`${inputBase} ${inputOk}`}
                  />
                )}
                <FieldError msg={errors.state} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5">ZIP / Postal Code <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={zip}
                  onChange={e => setZip(e.target.value)}
                  onBlur={() => touch('zip')}
                  className={`${inputBase} ${errors.zip ? inputErr : inputOk}`}
                />
                <FieldError msg={errors.zip} />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5">Country</label>
                <select
                  value={country}
                  onChange={e => { setCountry(e.target.value); setState('') }}
                  className={`${selectBase} ${inputOk}`}
                >
                  {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Create Password</p>
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => touch('password')}
                  className={`${inputBase} pr-12 ${(errors.password || errors.passwordReq) ? inputErr : inputOk}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <FieldError msg={errors.passwordReq || errors.password} />

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

              {/* Requirements checklist */}
              {touched.password && (
                <ul className="mt-2 space-y-0.5">
                  {[
                    { ok: password.length >= 8,        label: 'At least 8 characters' },
                    { ok: /[A-Z]/.test(password),      label: 'One uppercase letter' },
                    { ok: /[0-9]/.test(password),      label: 'One number' },
                    { ok: /[^A-Za-z0-9]/.test(password), label: 'One special character' },
                  ].map(r => (
                    <li key={r.label} className={`text-xs flex items-center gap-1.5 ${r.ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <span>{r.ok ? '✓' : '○'}</span>{r.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onBlur={() => touch('confirm')}
                  className={`${inputBase} pr-12 ${errors.confirm ? inputErr : inputOk}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
              <FieldError msg={errors.confirm} />
            </div>
          </div>

          {registerError && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {registerError}
            </p>
          )}

          <button
            type="submit"
            disabled={registering}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
          >
            {registering ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function OnboardPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-sm">Loading…</div>}>
      <OnboardContent />
    </Suspense>
  )
}
