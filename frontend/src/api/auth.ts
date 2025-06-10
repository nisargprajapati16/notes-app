import axios from './axios';

export interface AuthResponse {
  user: { id: string; email: string };
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const res = await axios.post<AuthResponse>('/api/auth/signup', { email, password });
  return res.data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await axios.post<AuthResponse>('/api/auth/login', { email, password });
  return res.data;
}

export async function getCurrentUser(): Promise<AuthResponse> {
  const res = await axios.post<AuthResponse>('/api/auth/refresh-token');
  return res.data;
}

export async function logout(): Promise<void> {
  await axios.post('/api/auth/logout');
}

export async function refreshToken(): Promise<AuthResponse> {
  const res = await axios.post<AuthResponse>('/api/auth/refresh-token');
  return res.data;
} 