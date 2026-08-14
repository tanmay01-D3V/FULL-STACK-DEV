import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const EMPTY_FORM = {
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  email: '',
  website: '',
  description: '',
}

export default function HospitalForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    ;(async () => {
      try {
      const { hospital } = await api.getHospital(id)
      if (cancelled) return
      const formData = { ...hospital }
      delete formData._id
      setForm({ ...EMPTY_FORM, ...formData })
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load hospital')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) {
      setError('Hospital name is required')
      return
    }

    setSaving(true)
    try {
      if (isEdit) {
        await api.updateHospital(id, form)
      } else {
        await api.createHospital(form)
      }
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to save hospital')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card skeleton" style={{ minHeight: 420 }} />
      </div>
    )
  }

  return (
    <div className="container container-narrow">
      <div className="page-header">
        <div>
          <Link to="/" className="back-link">← Back to hospitals</Link>
          <h1>{isEdit ? 'Edit hospital' : 'Add a hospital'}</h1>
          <p className="subtitle">
            {isEdit ? 'Update the details below.' : 'Fill in the details to register a new hospital.'}
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card form-card">
        <div className="form-grid">
          <label className="field field-span">
            Hospital name *
            <input type="text" value={form.name} onChange={update('name')} placeholder="City General Hospital" autoFocus />
          </label>

          <label className="field field-span">
            Address
            <input type="text" value={form.address} onChange={update('address')} placeholder="123 Main Street" />
          </label>

          <label className="field">
            City
            <input type="text" value={form.city} onChange={update('city')} placeholder="Mumbai" />
          </label>

          <label className="field">
            State
            <input type="text" value={form.state} onChange={update('state')} placeholder="Maharashtra" />
          </label>

          <label className="field">
            Zip code
            <input type="text" value={form.zipCode} onChange={update('zipCode')} placeholder="400001" />
          </label>

          <label className="field">
            Phone
            <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 98765 43210" />
          </label>

          <label className="field">
            Email
            <input type="email" value={form.email} onChange={update('email')} placeholder="info@citygeneral.com" />
          </label>

          <label className="field field-span">
            Website
            <input type="url" value={form.website} onChange={update('website')} placeholder="https://citygeneral.com" />
          </label>

          <label className="field field-span">
            Description
            <textarea rows="3" value={form.description} onChange={update('description')} placeholder="Brief description of the hospital…" />
          </label>
        </div>

        <div className="form-actions">
          <Link to="/" className="btn btn-ghost">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create hospital'}
          </button>
        </div>
      </form>
    </div>
  )
}
