import client from "./client";

const BASE = "/auth";

export function login({ email, password }) {
  return client.post(`${BASE}/login`, { email, password });
}

export function signup({ name, email, password }) {
  return client.post(`${BASE}/signup`, { name, email, password });
}
