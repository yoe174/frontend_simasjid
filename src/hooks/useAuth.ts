// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  // tambahkan field lain sesuai kebutuhan
}

interface AuthData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSuperAdmin: boolean;
}

export const useAuth = (): AuthData => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ambil data dari localStorage saat component mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Jika ada error parsing, hapus data yang rusak
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
  }, []);

  // Helper untuk check apakah user adalah superadmin
  const isSuperAdmin = user?.role_id === 1;

  return {
    user,
    token,
    isLoading,
    isSuperAdmin,
  };
};