import { API_CONFIG } from '../config/api';

const API_URL = API_CONFIG.BACKEND_URL;

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Login failed");
  return res.json(); // { token }
}

export async function signup(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Signup failed");
  return res.json(); // { token }
}

export function getJwt() {
  return localStorage.getItem('jwt');
}

export async function getMe() {
  const token = getJwt();
  if (!token) throw new Error('No JWT found');
  const res = await fetch(`${API_URL}/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch user info');
  return res.json();
}

export async function saveClassSession(
  attentiveness: number
) {
  const token = getJwt();

  if (!token) {
    throw new Error('No JWT found');
  }

  const response = await fetch(
    `${API_URL}/class-session`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        attentiveness,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to save class session'
    );
  }

  return data;
}