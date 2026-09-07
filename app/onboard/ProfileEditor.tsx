'use client'

import { useCallback, useState } from 'react'
import { US_STATES, CA_PROVINCES, COUNTRIES } from '@/lib/geo'
import { useGooglePlaces } from '@/lib/useGooglePlaces'

const inputBase = 'w-full px-3 py-2.5 border rounded-lg text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none leading-5'
const selectBase = `${inputBase} bg-white bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7280'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem] pr-10`
const inputOk = 'border-slate-200'
const inputErr = 'border-red-400 bg-red-50'

export interface Profile {
  first_name: string
  last_name: string
  email: string
  phone: string | null
  company_name: string | null
  address: string | null
  address2: string | null
  city: string
  state: string
  zip: string
  country: string
  completed: boolean
}

function FieldError({ msg }: { msg: string }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null
}

function countryLabel(code: string) {
  return COUNTRIES.find(c => c.value === code)?.label ?? code
}

function regionLabel(country: string, state: string) {
  const list = country === 'CA' ? CA_PROVINCES : country === 'US' ? US_STATES : []
  return list.find(s => s.value === state)?.label ?? state
}

export function formatAddress(p: Profile) {
  const line1 = [p.address, p.address2].filter(Boolean).join(', ')
  const region = regionLabel(p.country, p.state)
  const line2 = [p.city, region, p.zip].filter(Boolean).join(', ')
  const country = countryLabel(p.country)
  return [line1, line2, country].filter(Boolean).join('\n')
}

export default function ProfileEditor({
  profile,
  onCancel,
  onSaved,
}: {
  profile: Profile
  onCancel: () => void
  onSaved: (profile: Profile) => void
}) {
  const [firstName, setFirstName] = useState(profile.first_name)
  const [lastName, setLastName] = useState(profile.last_name)
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [companyName, setCompanyName] = useState(profile.company_name ?? '')
  const [address, setAddress] = useState(profile.address ?? '')
  const [address2, setAddress2] = useState(profile.address2 ?? '')
  const [city, setCity] = useState(profile.city ?? '')
  const [state, setState] = useState(profile.state ?? '')
  const [zip, setZip] = useState(profile.zip ?? '')
  const [country, setCountry] = useState(profile.country || 'US')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const places = useGooglePlaces(true)
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
    places.clear()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function touch(field: string) {
    setTouched(t => ({ ...t, [field]: true }))
  }

  const errors = {
    firstName: touched.firstName && !firstName.trim() ? 'First name is required.' : '',
    lastName: touched.lastName && !lastName.trim() ? 'Last name is required.' : '',
    companyName: touched.companyName && !companyName.trim() ? 'Company name is required.' : '',
    phone: touched.phone && !phone.trim()
      ? 'Phone number is required.'
      : touched.phone && !/^[\d\s\-()+.]{7,20}$/.test(phone)
        ? 'Enter a valid phone number.'
        : '',
    address: touched.address && !address.trim() ? 'Street address is required.' : '',
    city: touched.city && !city.trim() ? 'City is required.' : '',
    state: touched.state && (country === 'US' || country === 'CA') && !state ? 'Please select a state / province.' : '',
    zip: touched.zip && !zip.trim() ? 'ZIP / Postal code is required.' : '',
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setTouched({
      firstName: true, lastName: true, companyName: true, phone: true,
      address: true, city: true, state: true, zip: true,
    })
    if (!firstName.trim() || !lastName.trim() || !companyName.trim() || !phone.trim() || !address.trim() || !city.trim() || !zip.trim()) {
      setSaveError('Please fill in all required fields.')
      return
    }
    if ((country === 'US' || country === 'CA') && !state) {
      setSaveError('Please select a state or province.')
      return
    }
    if (!/^[\d\s\-()+.]{7,20}$/.test(phone)) {
      setSaveError('Please enter a valid phone number.')
      return
    }

    setSaveError('')
    setSaving(true)
    try {
      const res = await fetch('/api/onboard/me', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, lastName, phone, companyName, address, address2, city, state, zip, country,
        }),
      })
      if (res.status === 401) {
        window.location.href = '/onboard/login'
        return
      }
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error ?? 'Failed to save.')
        return
      }
      onSaved(data.profile)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5">First Name <span className="text-red-400">*</span></label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} onBlur={() => touch('firstName')} className={`${inputBase} ${errors.firstName ? inputErr : inputOk}`} />
          <FieldError msg={errors.firstName} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5">Last Name <span className="text-red-400">*</span></label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} onBlur={() => touch('lastName')} className={`${inputBase} ${errors.lastName ? inputErr : inputOk}`} />
          <FieldError msg={errors.lastName} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-800 mb-1.5">Email Address</label>
        <input type="email" value={profile.email} readOnly className={`${inputBase} ${inputOk} text-slate-500 bg-slate-50 cursor-not-allowed`} />
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-800 mb-1.5">Company Name <span className="text-red-400">*</span></label>
        <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} onBlur={() => touch('companyName')} className={`${inputBase} ${errors.companyName ? inputErr : inputOk}`} />
        <FieldError msg={errors.companyName} />
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-800 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} onBlur={() => touch('phone')} className={`${inputBase} ${errors.phone ? inputErr : inputOk}`} />
        <FieldError msg={errors.phone} />
      </div>

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
          <input type="text" value={address2} onChange={e => setAddress2(e.target.value)} className={`${inputBase} ${inputOk}`} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">City <span className="text-red-400">*</span></label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} onBlur={() => touch('city')} className={`${inputBase} ${errors.city ? inputErr : inputOk}`} />
            <FieldError msg={errors.city} />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">
              {country === 'CA' ? 'Province' : 'State'}{(country === 'US' || country === 'CA') && <span className="text-red-400"> *</span>}
            </label>
            {country === 'US' ? (
              <select value={state} onChange={e => setState(e.target.value)} onBlur={() => touch('state')} className={`${selectBase} ${errors.state ? inputErr : inputOk}`}>
                <option value="">— Select —</option>
                {US_STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            ) : country === 'CA' ? (
              <select value={state} onChange={e => setState(e.target.value)} onBlur={() => touch('state')} className={`${selectBase} ${errors.state ? inputErr : inputOk}`}>
                <option value="">— Select —</option>
                {CA_PROVINCES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            ) : (
              <input type="text" value={state} onChange={e => setState(e.target.value)} className={`${inputBase} ${inputOk}`} />
            )}
            <FieldError msg={errors.state} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">ZIP / Postal Code <span className="text-red-400">*</span></label>
            <input type="text" value={zip} onChange={e => setZip(e.target.value)} onBlur={() => touch('zip')} className={`${inputBase} ${errors.zip ? inputErr : inputOk}`} />
            <FieldError msg={errors.zip} />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">Country</label>
            <select value={country} onChange={e => { setCountry(e.target.value); setState('') }} className={`${selectBase} ${inputOk}`}>
              {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {saveError && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{saveError}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors cursor-pointer"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-navy-800 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
