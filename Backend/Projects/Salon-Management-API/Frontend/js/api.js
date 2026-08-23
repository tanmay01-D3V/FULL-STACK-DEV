const API_BASE_URL = "http://localhost:3000";

async function apiRequest(path, options = {}) {
  const { method = "GET", body, auth = true } = options;

  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = typeof getToken === "function" ? getToken() : null;
  if (auth && token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Make sure the backend is running on port 3000.");
  }

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    if (res.status === 401 && token && auth) {
      document.dispatchEvent(new CustomEvent("auth:expired"));
    }
    throw new Error(payload?.message || `Request failed (${res.status})`);
  }

  return payload;
}

const AuthAPI = {
  signup(name, email, password) {
    return apiRequest("/auth/signup", {
      method: "POST",
      auth: false,
      body: { name, email, password },
    });
  },
  login(email, password) {
    return apiRequest("/auth/login", {
      method: "POST",
      auth: false,
      body: { email, password },
    });
  },
};

const ServicesAPI = {
  getAll() {
    return apiRequest("/services", { auth: false });
  },
  getById(id) {
    return apiRequest(`/services/${encodeURIComponent(id)}`, { auth: false });
  },
  create(payload) {
    return apiRequest("/services", { method: "POST", body: payload });
  },
  update(id, payload) {
    return apiRequest(`/services/${encodeURIComponent(id)}`, { method: "PUT", body: payload });
  },
  remove(id) {
    return apiRequest(`/services/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};
