const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  let data: any;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Login failed');
  }

  // Simpan token dan user (pastikan XSS dicegah)
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

export const logout = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/api/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  // Bersihkan localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
