import { useEffect, useRef, useState } from 'react'
import { COUNTRIES } from '@/lib/geo'

declare global {
  interface Window { google: typeof google }
}

const COUNTRY_MAP: Record<string, string> = {
  ...Object.fromEntries(COUNTRIES.map(c => [c.value, c.value])),
}

export interface ParsedAddress {
  address: string
  address2: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Suggestion {
  description: string
  placeId: string
}

export function useGooglePlaces(active: boolean) {
  const [query, setQuery]           = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading]       = useState(false)
  const debounceRef                 = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sessionTokenRef             = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const serviceRef                  = useRef<google.maps.places.AutocompleteService | null>(null)

  // Initialise the AutocompleteService once Google is ready
  useEffect(() => {
    if (!active) return
    let cancelled = false

    async function init() {
      if (typeof window.google === 'undefined' || !window.google.maps) {
        setTimeout(init, 100)
        return
      }
      if (cancelled) return
      const { AutocompleteService, AutocompleteSessionToken } =
        await google.maps.importLibrary('places') as google.maps.PlacesLibrary
      if (cancelled) return
      serviceRef.current = new AutocompleteService()
      sessionTokenRef.current = new AutocompleteSessionToken()
    }

    init()
    return () => { cancelled = true }
  }, [active])

  // Fetch predictions as user types
  useEffect(() => {
    if (!query.trim() || !serviceRef.current) {
      setSuggestions([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        serviceRef.current!.getPlacePredictions(
          { input: query, sessionToken: sessionTokenRef.current ?? undefined, types: ['address'] },
          (preds, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && preds) {
              setSuggestions(preds.map(p => ({ description: p.description, placeId: p.place_id })))
            } else {
              setSuggestions([])
            }
            setLoading(false)
          }
        )
      } catch { setLoading(false) }
    }, 250)
  }, [query])

  async function selectPlace(placeId: string): Promise<ParsedAddress | null> {
    if (typeof window.google === 'undefined') return null
    const { PlacesService } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary

    // PlacesService needs a dummy div
    const dummy = document.createElement('div')
    const svc   = new PlacesService(dummy)

    return new Promise(resolve => {
      svc.getDetails(
        {
          placeId,
          fields: ['address_components'],
          sessionToken: sessionTokenRef.current ?? undefined,
        },
        (place, status) => {
          // Reset session token after completing a session
          google.maps.importLibrary('places').then(lib => {
            const { AutocompleteSessionToken } = lib as google.maps.PlacesLibrary
            sessionTokenRef.current = new AutocompleteSessionToken()
          })

          if (status !== google.maps.places.PlacesServiceStatus.OK || !place?.address_components) {
            resolve(null)
            return
          }

          const get = (type: string, short = false) => {
            const comp = place.address_components!.find(c => c.types.includes(type))
            return comp ? (short ? comp.short_name : comp.long_name) : ''
          }

          const googleCountry = get('country', true)
          resolve({
            address:  [get('street_number'), get('route')].filter(Boolean).join(' '),
            address2: '',
            city:     get('locality') || get('sublocality') || get('postal_town'),
            state:    get('administrative_area_level_1', true),
            zip:      get('postal_code'),
            country:  COUNTRY_MAP[googleCountry] ?? googleCountry,
          })
        }
      )
    })
  }

  function clear() {
    setQuery('')
    setSuggestions([])
  }

  return { query, setQuery, suggestions, loading, selectPlace, clear }
}
