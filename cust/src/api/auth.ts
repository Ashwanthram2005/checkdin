import api from './client';

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  gender?: string;
  emergency_name?: string;
  emergency_phone?: string;
  emergency_relation?: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export async function loginCustomer(data: {
  email?: string;
  phone?: string;
  name?: string;
  city?: string;
}): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/auth/login/customer', data);
  return res.data;
}

export async function getMe(): Promise<ApiUser> {
  const res = await api.get<ApiUser>('/api/auth/me');
  return res.data;
}

export async function updateProfile(fields: Partial<{
  name: string;
  email: string;
  phone: string;
  city: string;
  gender: string;
  emergency_name: string;
  emergency_phone: string;
  emergency_relation: string;
}>): Promise<void> {
  await api.put('/api/auth/profile', fields);
}
