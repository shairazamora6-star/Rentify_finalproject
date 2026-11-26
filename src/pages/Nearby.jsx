import { useState } from 'react'
import { LocateFixed, MapPin, Search } from 'lucide-react'
import ItemCard from '../components/ItemCard'
import './Nearby.css'

export default function Nearby() {
  const [location, setLocation] = useState('')
  const [results, setResults] = useState(null)
  const [resolvedLocation, setResolvedLocation] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const findNearby = async (params) => {
    setError('')
    setIsLoading(true)
    try {
      const query = new URLSearchParams(params)
      const response = await fetch(`/api/nearby?${query}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to find nearby rentals.')
      setResults(data.items)
      setResolvedLocation(data.location)
    } catch (requestError) {
      setError(requestError.message || 'Unable to find nearby rentals. Please try again.')
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  const submitLocation = (event) => {
    event.preventDefault()
    if (location.trim()) findNearby({ location: location.trim() })
  }

  const useDeviceLocation = () => {
    setError('')
    if (!navigator.geolocation) {
      setError('Location access is not available in this browser. Enter a city or ZIP code instead.')
      return
    }
    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => findNearby({ lat: String(coords.latitude), lon: String(coords.longitude) }),
      (locationError) => {
        setIsLoading(false)
        setError(locationError.code === locationError.PERMISSION_DENIED
          ? 'Location permission was denied. Enter a city or ZIP code instead.'
          : 'We could not get your location. Enter a city or ZIP code instead.')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }

  return (
    <main className="page nearby-page">
      <section className="nearby-intro">
        <span className="nearby-kicker">LOCAL RENTALS</span>
        <h1>Find useful things nearby</h1>
        <p>Explore items listed in your area. Your location is only used for this search and is not saved.</p>
        <div className="nearby-controls">
          <button className="nearby-location-button" type="button" onClick={useDeviceLocation} disabled={isLoading}>
            <LocateFixed size={18} />
            {isLoading ? 'Finding rentals…' : 'Use my location'}
          </button>
          <span className="nearby-or">or</span>
          <form className="nearby-search" onSubmit={submitLocation}>
            <MapPin size={17} aria-hidden="true" />
            <input
              aria-label="City or ZIP code"
              placeholder="Enter a city or ZIP code"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              required
            />
            <button type="submit" aria-label="Search location" disabled={isLoading}><Search size={17} /></button>
          </form>
        </div>
        <p className="nearby-note">Showing listings within about 100 miles. Distances use listing-city centers; owners’ precise locations are never shown.</p>
      </section>

      {error && <div className="nearby-error" role="alert">{error}</div>}

      {results && (
        <section className="nearby-results" aria-live="polite">
          <div className="nearby-results-heading">
            <div>
              <span className="nearby-kicker">AVAILABLE LISTINGS</span>
              <h2>Near {resolvedLocation}</h2>
            </div>
            <span>{results.length} {results.length === 1 ? 'rental' : 'rentals'}</span>
          </div>
          {results.length ? (
            <div className="rental-grid">
              {results.map(item => (
                <ItemCard item={item} key={item.id} />
              ))}
            </div>
          ) : (
            <p className="nearby-empty">No available rentals were found for this location yet.</p>
          )}
        </section>
      )}
    </main>
  )
}
