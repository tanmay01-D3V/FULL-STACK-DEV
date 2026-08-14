import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import HospitalCard from '../components/HospitalCard'

export default function Dashboard() {
  const [hospitals, setHospitals] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)

  async function loadHospitals() {
    try {
      const data = await api.getHospitals()
      setHospitals(data.hospitals || [])
    } catch (err) {
      setError(err.message || 'Failed to load hospitals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Data fetching on mount — state updates happen after the awaited request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadHospitals()
  }, [])

  async function confirmDelete() {
    if (!deleting) return
    try {
      await api.deleteHospital(deleting._id)
      setHospitals((prev) => prev.filter((h) => h._id !== deleting._id))
      setDeleting(null)
    } catch (err) {
      setError(err.message || 'Failed to delete hospital')
      setDeleting(null)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return hospitals
    return hospitals.filter((h) =>
      [h.name, h.city, h.address, h.phone, h.email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    )
  }, [hospitals, query])

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Hospitals</h1>
          <p className="subtitle">Manage the network of registered hospitals.</p>
        </div>
        <Link to="/hospitals/new" className="btn btn-primary">
          + Add Hospital
        </Link>
      </div>

      <div className="toolbar">
        <input
          type="search"
          className="search"
          placeholder="Search by name, city, address, phone or email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="count">{filtered.length} of {hospitals.length}</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏥</div>
          <h2>{hospitals.length === 0 ? 'No hospitals yet' : 'No matches found'}</h2>
          <p>
            {hospitals.length === 0
              ? 'Get started by adding your first hospital.'
              : 'Try a different search term.'}
          </p>
          {hospitals.length === 0 && (
            <Link to="/hospitals/new" className="btn btn-primary">
              Add Hospital
            </Link>
          )}
        </div>
      ) : (
        <div className="grid">
          {filtered.map((hospital) => (
            <HospitalCard
              key={hospital._id}
              hospital={hospital}
              onDelete={() => setDeleting(hospital)}
            />
          ))}
        </div>
      )}

      {deleting && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Delete hospital</h2>
            <p>
              Are you sure you want to delete <strong>{deleting.name}</strong>? This action
              cannot be undone.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setDeleting(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
