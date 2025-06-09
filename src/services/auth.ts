// src\services\auth.ts
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be.masjidin.my.id';

// export const login = async (email: string, password: string) => {
//   const response = await fetch(`${API_URL}/api/login`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ email, password }),
//   });

//   let data: any;

//   try {
//     data = await response.json();
//   } catch (error) {
//     throw new Error('Invalid response from server');
//   }

//   if (!response.ok) {
//     throw new Error(data?.message || 'Login failed');
//   }

//   // Simpan token dan user (pastikan XSS dicegah)
//   localStorage.setItem('token', data.access_token);
//   localStorage.setItem('user', JSON.stringify(data.user));

//   return data;
// };

// export const logout = async () => {
//   const token = localStorage.getItem('token');

//   const response = await fetch(`${API_URL}/api/logout`, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`,
//       Accept: 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Logout failed');
//   }

//   // Bersihkan localStorage
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
// };


import { apiUrl } from "@/utils/fetch";

/**
 * Helper untuk request yang membutuhkan token.
 */
export const fetchWithToken = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  // ⬇️ Pakai object biasa, bukan HeadersInit langsung
  const headers: { [key: string]: string } = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers as { [key: string]: string }), // optional: copy custom headers
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(apiUrl(endpoint), {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Request failed");
  }

  return response.json();
};

export const login = async (email: string, password: string) => {
  const response = await fetch(apiUrl("/api/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  let data: any;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Invalid response from server");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Login failed");
  }

  // Simpan token & user di localStorage
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

export const logout = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(apiUrl("/api/logout"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  // Hapus data dari localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
