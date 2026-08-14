const API_BASE = ''

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const body = await res.text()
  let data = null
  if (body) {
    try {
      data = JSON.parse(body)
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    const error = new Error(
      (data && (data.message || data.error)) || `Request failed (${res.status})`
    )
    error.status = res.status
    throw error
  }

  return data
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout', { method: 'POST' }),

  getHospitals: () => request('/hospitals'),
  getHospital: (id) => request(`/hospitals/${id}`),
  createHospital: (payload) => request('/hospitals', { method: 'POST', body: JSON.stringify(payload) }),
  updateHospital: (id, payload) => request(`/hospitals/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteHospital: (id) => request(`/hospitals/${id}`, { method: 'DELETE' }),
}
