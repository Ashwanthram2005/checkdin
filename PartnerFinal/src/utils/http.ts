const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  token?: string;
}

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('checkdin-partner-session');
    if (raw) {
      const session = JSON.parse(raw);
      return session.token || null;
    }
  } catch {
    return null;
  }
  return null;
}

export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  const authToken = token || getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export function get<T>(path: string, token?: string): Promise<T> {
  return http<T>(path, { method: 'GET', token });
}

export function post<T>(path: string, body?: unknown, token?: string): Promise<T> {
  return http<T>(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    token,
  });
}

export function put<T>(path: string, body?: unknown, token?: string): Promise<T> {
  return http<T>(path, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
    token,
  });
}

export function del<T>(path: string, token?: string): Promise<T> {
  return http<T>(path, { method: 'DELETE', token });
}
