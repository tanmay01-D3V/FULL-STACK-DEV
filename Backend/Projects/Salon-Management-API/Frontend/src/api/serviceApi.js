import client from "./client";

const BASE = "/services";

export async function listServices() {
  const { data } = await client.get(BASE);
  return data.data ?? [];
}

export async function getService(id) {
  const { data } = await client.get(`${BASE}/${id}`);
  return data.data;
}

export async function createService(payload) {
  const { data } = await client.post(BASE, payload);
  return data.data;
}

export async function updateService(id, payload) {
  const { data } = await client.put(`${BASE}/${id}`, payload);
  return data.data;
}

export async function deleteService(id) {
  await client.delete(`${BASE}/${id}`);
}
