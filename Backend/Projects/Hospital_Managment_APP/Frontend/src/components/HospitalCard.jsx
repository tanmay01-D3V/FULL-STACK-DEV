import { Link } from 'react-router-dom'

const FALLBACK_INITIALS = 'H'

function initialsOf(name) {
  if (!name) return FALLBACK_INITIALS
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function HospitalCard({ hospital, onDelete }) {
  const { name = 'Untitled hospital', city, address, phone, email, description } = hospital

  return (
    <div className="card hospital-card">
      <div className="hospital-head">
        <div className="avatar">{initialsOf(name)}</div>
        <Link to={`/hospitals/${hospital._id}/edit`} className="btn-icon" title="Edit">
          ✎
        </Link>
      </div>

      <h3>{name}</h3>

      <ul className="details">
        {city && (
          <li>📍 {city}{address ? ` — ${address}` : ''}</li>
        )}
        {phone && <li>📞 {phone}</li>}
        {email && <li>✉️ {email}</li>}
      </ul>

      {description && <p className="description">{description}</p>}

      <div className="card-actions">
        <Link to={`/hospitals/${hospital._id}/edit`} className="btn btn-ghost">
          Edit
        </Link>
        <button type="button" className="btn btn-danger-ghost" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}
