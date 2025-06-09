// src/components/guards/AdminGuard.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface AdminGuardProps {
  children: ReactNode;
  fallbackUrl?: string;
}

export const AdminGuard = ({ 
  children, 
  fallbackUrl = '/admin/dashboard' 
}: AdminGuardProps) => {
  const { user, isSuperAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jika sudah selesai loading dan user bukan superadmin
    if (!isLoading && !isSuperAdmin) {
      console.log('Access denied: User is not superadmin', { 
        user_id: user?.user_id, 
        role_id: user?.role_id 
      });
      
      // Redirect ke dashboard atau halaman yang diizinkan
      router.replace(fallbackUrl);
    }
  }, [isLoading, isSuperAdmin, router, fallbackUrl, user]);

  // Tampilkan loading saat mengecek auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // Jika bukan superadmin, tampilkan pesan loading sambil redirect
  if (!isSuperAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-gray-600">Mengalihkan...</p>
        </div>
      </div>
    );
  }

  // Jika superadmin, tampilkan konten
  return <>{children}</>;
};