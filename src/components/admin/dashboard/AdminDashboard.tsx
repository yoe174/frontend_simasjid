'use client';

import React, { useState, useEffect } from 'react';
import { Users, Info, Calendar, Clock, TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart } from 'lucide-react';

// Type definitions
interface StatItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  iconColor: string;
  darkBgColor: string;
  darkIconColor: string;
  value: number;
}

interface TransaksiSummary {
  pemasukan: number;
  pengeluaran: number;
  draft: number;
  saldo_tunai: number;
  saldo_rekening: number;
  total_saldo: number;
}

interface ChartData {
  labels: string[];
  pemasukan: number[];
  pengeluaran: number[];
}

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animationKey, setAnimationKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [transaksiSummary, setTransaksiSummary] = useState<TransaksiSummary>({
    pemasukan: 0,
    pengeluaran: 0,
    draft: 0,
    saldo_tunai: 0,
    saldo_rekening: 0,
    total_saldo: 0
  });

  // Function to get auth token from localStorage or cookies
  const getAuthToken = (): string | null => {
    // Try to get token from localStorage first
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || 
             localStorage.getItem('auth_token') || 
             localStorage.getItem('access_token') ||
             sessionStorage.getItem('token') ||
             sessionStorage.getItem('auth_token') ||
             sessionStorage.getItem('access_token');
    }
    return null;
  };

  // Function to make authenticated API request
  const fetchWithAuth = async (url: string) => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (response.status === 401) {
      // Token might be expired, redirect to login
      console.error('Authentication failed, token might be expired');
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  // Fetch data statistik dari API
  const fetchStats = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://be.masjidin.my.id';
    
    const endpoints: Omit<StatItem, 'value'>[] = [
      {
        title: 'Total Admin',
        url: `${baseUrl}/api/user`,
        icon: Users,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
        darkBgColor: 'dark:bg-blue-900/20',
        darkIconColor: 'dark:text-blue-400'
      },
      {
        title: 'Informasi',
        url: `${baseUrl}/api/informasi`,
        icon: Info,
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600',
        darkBgColor: 'dark:bg-green-900/20',
        darkIconColor: 'dark:text-green-400'
      },
      {
        title: 'Kegiatan',
        url: `${baseUrl}/api/kegiatan`,
        icon: Calendar,
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600',
        darkBgColor: 'dark:bg-purple-900/20',
        darkIconColor: 'dark:text-purple-400'
      },
      {
        title: 'Reservasi',
        url: `${baseUrl}/api/reservasi`,
        icon: Clock,
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-600',
        darkBgColor: 'dark:bg-orange-900/20',
        darkIconColor: 'dark:text-orange-400'
      }
    ];

    try {
      const fetchPromises = endpoints.map(async (endpoint): Promise<StatItem> => {
        try {
          let data;
          
          // For protected endpoints (user and reservasi), use authenticated request
          if (endpoint.url.includes('/user') || endpoint.url.includes('/reservasi')) {
            data = await fetchWithAuth(endpoint.url);
          } else {
            // For public endpoints (informasi and kegiatan), use normal fetch
            const response = await fetch(endpoint.url);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            data = await response.json();
          }
          
          let count = 0;
          if (Array.isArray(data)) {
            count = data.length;
          } else if (data && typeof data === 'object') {
            if (data.data && Array.isArray(data.data)) {
              count = data.data.length;
            } else if (data.count !== undefined) {
              count = data.count;
            } else if (data.total !== undefined) {
              count = data.total;
            }
          }

          return {
            ...endpoint,
            value: count
          };
        } catch (error) {
          console.error(`Error fetching ${endpoint.title}:`, error);
          return {
            ...endpoint,
            value: 0
          };
        }
      });

      const results = await Promise.all(fetchPromises);
      setStats(results);
    } catch (error) {
      console.error('Error fetching stats:', error);
      const fallbackStats: StatItem[] = endpoints.map(endpoint => ({
        ...endpoint,
        value: 0
      }));
      setStats(fallbackStats);
    }
  };

  // Fetch data summary transaksi dari API
  const fetchTransaksiSummary = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://be.masjidin.my.id';
      const data = await fetchWithAuth(`${baseUrl}/api/transaksi/summary`);
      setTransaksiSummary(data);
    } catch (error) {
      console.error('Error fetching transaksi summary:', error);
      // Set default values jika gagal fetch
      setTransaksiSummary({
        pemasukan: 0,
        pengeluaran: 0,
        draft: 0,
        saldo_tunai: 0,
        saldo_rekening: 0,
        total_saldo: 0
      });
    }
  };

  // Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch data saat component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchTransaksiSummary()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Refresh data setiap 30 detik
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      fetchStats();
      fetchTransaksiSummary();
    }, 30000);

    return () => clearInterval(refreshTimer);
  }, []);

  // Trigger animasi ulang setiap 5 detik
  useEffect(() => {
    const animationTimer = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 5000);

    return () => clearInterval(animationTimer);
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Data untuk chart
  const chartData: ChartData = {
    labels: ['Pemasukan', 'Pengeluaran'],
    pemasukan: [transaksiSummary.pemasukan],
    pengeluaran: [transaksiSummary.pengeluaran]
  };

  const maxValue = Math.max(transaksiSummary.pemasukan, transaksiSummary.pengeluaran);
  const totalTransaksi = transaksiSummary.pemasukan + transaksiSummary.pengeluaran;
  const pemasukanPercentage = totalTransaksi > 0 ? (transaksiSummary.pemasukan / totalTransaksi) * 100 : 50;
  const pengeluaranPercentage = totalTransaksi > 0 ? (transaksiSummary.pengeluaran / totalTransaksi) * 100 : 50;

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <div className="p-6 space-y-8">
        {loading && (
          <div className="fixed inset-0 bg-white/75 dark:bg-gray-900/75 flex items-center justify-center z-50 transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
          </div>
        )}
        
        {/* Header Section */}
        <div className="rounded-[10px] bg-white dark:bg-gray-800 shadow-1 dark:shadow-card border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Assalamu'alaikum, Admin! 🕌
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300">
                Selamat datang di Dashboard Sistem Informasi Masjid
              </p>
              {/* <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Data akan otomatis terupdate setiap 30 detik
              </p> */}
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 transition-colors duration-300">
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 transition-colors duration-300">
                  {formatTime(currentTime)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  {formatDate(currentTime)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards dengan rounded style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="rounded-[10px] bg-white dark:bg-gray-800 shadow-1 dark:shadow-card border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium transition-colors duration-300">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white transition-colors duration-300">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.darkBgColor} transition-colors duration-300`}>
                    <IconComponent className={`w-6 h-6 ${stat.iconColor} ${stat.darkIconColor} transition-colors duration-300`} />
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-300">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${Math.min((stat.value / 25) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="rounded-[10px] bg-white dark:bg-gray-800 shadow-1 dark:shadow-card border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Bar Chart Keuangan</h2>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Perbandingan pemasukan dan pengeluaran</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Pemasukan Bar */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                    <span className="font-medium text-gray-700 dark:text-gray-200">Pemasukan</span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(transaksiSummary.pemasukan)}
                  </span>
                </div>
                <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-lg transition-all duration-2000 ease-out relative"
                    style={{
                      width: maxValue > 0 ? `${(transaksiSummary.pemasukan / maxValue) * 100}%` : '0%'
                    }}
                  >
                    <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Pengeluaran Bar */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="font-medium text-gray-700 dark:text-gray-200">Pengeluaran</span>
                  </div>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(transaksiSummary.pengeluaran)}
                  </span>
                </div>
                <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-lg transition-all duration-2000 ease-out relative"
                    style={{
                      width: maxValue > 0 ? `${(transaksiSummary.pengeluaran / maxValue) * 100}%` : '0%'
                    }}
                  >
                    <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">Selisih:</span>
                  <span className={`font-bold ${
                    transaksiSummary.pemasukan - transaksiSummary.pengeluaran >= 0 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(transaksiSummary.pemasukan - transaksiSummary.pengeluaran)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="rounded-[10px] bg-white dark:bg-gray-800 shadow-1 dark:shadow-card border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Pie Chart Keuangan</h2>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Distribusi pemasukan dan pengeluaran</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-6">
              {/* Custom Pie Chart */}
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                    className="dark:stroke-gray-600"
                  />
                  
                  {/* Pemasukan Arc */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="url(#emerald-gradient)"
                    strokeWidth="3"
                    strokeDasharray={`${pemasukanPercentage} ${100 - pemasukanPercentage}`}
                    strokeDashoffset="0"
                    className="transition-all duration-2000 ease-out"
                  />
                  
                  {/* Pengeluaran Arc */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="url(#red-gradient)"
                    strokeWidth="3"
                    strokeDasharray={`${pengeluaranPercentage} ${100 - pengeluaranPercentage}`}
                    strokeDashoffset={`-${pemasukanPercentage}`}
                    className="transition-all duration-2000 ease-out"
                  />

                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="red-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">
                    {formatCurrency(totalTransaksi)}
                  </p>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                    <span className="font-medium text-emerald-800 dark:text-emerald-200">Pemasukan</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700 dark:text-emerald-300">
                      {formatCurrency(transaksiSummary.pemasukan)}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      {pemasukanPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-red-800 dark:text-red-200">Pengeluaran</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-700 dark:text-red-300">
                      {formatCurrency(transaksiSummary.pengeluaran)}
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {pengeluaranPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Saldo</p>
                  <p className={`font-bold ${
                    transaksiSummary.total_saldo >= 0 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(transaksiSummary.total_saldo)}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Draft</p>
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    {transaksiSummary.draft}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;