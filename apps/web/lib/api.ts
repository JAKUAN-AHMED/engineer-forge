export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

async function request<T>(
  path: string,
  opts: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers, ...rest } = opts;
  const endpoint = path.startsWith('/api') ? path : `/api${path}`;
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) {
    const clone = res.clone();
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await clone.text();
    }
    const msg = typeof body === 'object' && body && 'error' in body ? (body as { error: string }).error : `HTTP ${res.status}`;
    throw new Error(msg);
  }

  try {
    return (await res.json()) as T;
  } catch {
    return (await res.text()) as unknown as T;
  }
}

export const api = {
  get:  <T>(path: string, token?: string | null) => request<T>(path, { token }),
  post: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}), token }),
};
