"use client";

const API_URL = 'http://localhost:8000';

type ApiRecord = Record<string, unknown>;

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null;
}

function getErrorMessage(body: unknown, fallback: string) {
  if (typeof body === 'string' && body.trim()) {
    return body.trim();
  }

  if (!isRecord(body)) {
    return fallback;
  }

  const detail = body.detail;
  if (typeof detail === 'string' && detail.trim()) {
    return detail.trim();
  }

  const message = body.message;
  if (typeof message === 'string' && message.trim()) {
    return message.trim();
  }

  const error = body.error;
  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  return fallback;
}

async function parseResponseBody(res: Response) {
  if (res.status === 204) {
    return null;
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json().catch(() => null);
  }

  const text = await res.text().catch(() => '');
  return text || null;
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

  const body = await parseResponseBody(res);

  if (!res.ok) {
    throw new Error(getErrorMessage(body, res.statusText || 'Request failed'));
  }

  return body;
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
    body: JSON.stringify({ chat_id: convId, content }),
  });
}

export async function getConversations() {
  return apiFetch('/api/chat/conversations');
}
