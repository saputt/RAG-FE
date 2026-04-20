import { useAuthStore } from "../store";

const BASE_URL = 'http://localhost:3000/api';

export interface FetchOptions extends RequestInit {
  body?: any;
}

export const fetchClient = async (endpoint: string, options: FetchOptions = {}) => {
  const token = useAuthStore.getState().token;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Handle multi-part/form-data (for file uploads)
  if (options.body instanceof FormData) {
    headers.delete('Content-Type'); // Let the browser set it with boundary
  } else if (options.body) {
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
};
