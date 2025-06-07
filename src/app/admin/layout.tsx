'use client';

import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Loading component
const AuthLoading = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">Memeriksa autentikasi...</p>
    </div>
  </div>
);

export default function AdminLayout({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        // Jika tidak ada token, redirect ke login
        if (!token) {
          router.push('/login/login');
          return;
        }

        // Validasi token dengan API (opsional tapi direkomendasikan)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const validUser = await response.json();
          setUser(validUser);
          setIsAuthenticated(true);
        } else {
          // Token tidak valid, hapus dan redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Jika terjadi error, anggap tidak authenticated
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login/login');
      }
    };

    checkAuth();
  }, [router]);

  // Tampilkan loading saat mengecek authentication
  if (isAuthenticated === null) {
    return <AuthLoading />;
  }

  // Jika tidak authenticated, return null (karena akan redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Jika authenticated, tampilkan layout normal
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              <Header />
              <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}