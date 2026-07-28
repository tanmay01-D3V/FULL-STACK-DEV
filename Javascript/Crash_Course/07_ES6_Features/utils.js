export const API_URL = "https://jsonplaceholder.typicode.com";

export async function fetchUsers() {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

export function formatUser(user) {
    return `${user.name} (${user.email})`;
}

// Default export — one per module
export default function greet(name) {
    return `Hello from module, ${name}!`;
}
