import { useEffect, useState } from 'react';

interface User {
  user_id: number;
  role_id: number;
  name: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data user dari session/cookie/localStorage
    const getUserData = async () => {
      try {
        // Contoh: ambil dari API atau session
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const isSuperAdmin = () => user?.role_id === 1;
  const isAdmin = () => user?.role_id === 2;

  return {
    user,
    loading,
    isSuperAdmin,
    isAdmin,
  };
};