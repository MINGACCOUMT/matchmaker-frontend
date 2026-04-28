"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || 'Request failed');
  }

  return res.json();
}

export async function login(email: string, password: string) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(data: Record<string, any>) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMe() {
  return apiFetch('/api/users/me');
}

export async function updateMe(data: Record<string, any>) {
  return apiFetch('/api/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function discoverUsers() {
  return apiFetch('/api/users/discover');
}

export async function likeUser(toUserId: number) {
  return apiFetch('/api/matches/like', {
    method: 'POST',
    body: JSON.stringify({ to_user_id: toUserId }),
  });
}

export async function getMatches() {
  return apiFetch('/api/matches');
}

export async function getMessages(convId: string) {
  return apiFetch(`/api/chat/messages/${convId}`);
}

export async function sendMessage(convId: string, content: string) {
  return apiFetch('/api/chat/messages', {
    method: 'POST',
    body: JSON.stringify({ conversation_id: convId, content }),
  });
}

export async function getConversations() {
  return apiFetch('/api/chat/conversations');
}
