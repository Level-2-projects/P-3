export interface Center {
  id: string;
  gov: string;
  badge: string;
  name: string;
  address: string;
  schedule: string;
  extraInfo: string;
  extraIcon: string;
  isEmergency?: boolean;
  lat: number;
  lng: number;
}

export interface Article {
  id: string;
  category: string;
  title: string;
  summary: string;
}

interface ApiEnvelope<T> {
  data?: T;
  items?: T;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

class ApiError extends Error {
  readonly status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const body = (await response.json()) as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch {
      // Keep the status-based message when the server does not return JSON.
    }

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

function unwrap<T>(response: T | ApiEnvelope<T>): T {
  if (typeof response === 'object' && response !== null && ('data' in response || 'items' in response)) {
    const envelope = response as ApiEnvelope<T>;
    return envelope.data ?? envelope.items ?? response as T;
  }

  return response as T;
}

export function getCenters(
  params: { governorate?: string; search?: string },
  signal?: AbortSignal,
): Promise<Center[]> {
  const query = new URLSearchParams();

  if (params.governorate && params.governorate !== 'all') {
    query.set('governorate', params.governorate);
  }

  if (params.search) {
    query.set('q', params.search);
  }

  const suffix = query.toString();
  return request<Center[] | ApiEnvelope<Center[]>>(
    `/api/v1/public/centers${suffix ? `?${suffix}` : ''}`,
    { signal },
  ).then(unwrap);
}

export function getPublishedArticles(signal?: AbortSignal): Promise<Article[]> {
  return request<Article[] | ApiEnvelope<Article[]>>('/api/v1/kb/published', { signal }).then(unwrap);
}

export function login(credentials: { email: string; password: string }): Promise<void> {
  return request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
