'use client';

import React, { useState, useEffect } from 'react';
import { Users, Info, Calendar, Clock, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

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

interface FinanceItem {
  category: string;
  amount: number;
  target: number;
  percentage: number;
  color: string;
  icon: React.ComponentType<any>;
}

interface ChartSeries {
  name: string;
  data: number[];
}

interface ChartData {
  series: ChartSeries[];
  options: {
    chart: {
      type: string;
      height: number;
      toolbar: {
        show: boolean;
      };
    };
    colors: string[];
    xaxis: {
      categories: string[];
    };
  } | null;
}

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animationKey, setAnimationKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [financeData, setFinanceData] = useState<FinanceItem[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    series: [],
    options: null
  });

  // Fetch data statistik dari API
  const fetchStats = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    
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
          const response = await fetch(endpoint.url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          
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
            value: Math.floor(Math.random() * 50) + 1 // Demo data
          };
        }
      });

      const results = await Promise.all(fetchPromises);
      setStats(results);
    } catch (error) {
      console.error('Error fetching stats:', error);
      const fallbackStats: StatItem[] = endpoints.map(endpoint => ({
        ...endpoint,
        value: Math.floor(Math.random() * 50) + 1 // Demo data
      }));
      setStats(fallbackStats);
    }
  };

  // Fetch data keuangan dari API
  const fetchFinanceData = async () => {
    try {
      const mockFinanceData: FinanceItem[] = [
        {
          category: 'Donasi',
          amount: 15750000,
          target: 21000000,
          percentage: 75,
          color: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
          icon: TrendingUp
        },
        {
          category: 'Zakat',
          amount: 8500000,
          target: 13000000,
          percentage: 65,
          color: 'bg-gradient-to-r from-blue-400 to-blue-500',
          icon: TrendingUp
        },
        {
          category: 'Infaq',
          amount: 5200000,
          target: 11500000,
          percentage: 45,
          color: 'bg-gradient-to-r from-purple-400 to-purple-500',
          icon: TrendingUp
        },
        {
          category: 'Operasional',
          amount: 12300000,
          target: 14500000,
          percentage: 85,
          color: 'bg-gradient-to-r from-rose-400 to-rose-500',
          icon: TrendingDown
        }
      ];
      
      setFinanceData(mockFinanceData);
      
      // Prepare chart data
      const chartConfig: ChartData = {
        series: [
          {
            name: 'Pemasukan',
            data: [15750000, 8500000, 5200000]
          },
          {
            name: 'Target',
            data: [21000000, 13000000, 11500000]
          },
          {
            name: 'Pengeluaran',
            data: [0, 0, 12300000]
          }
        ],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            toolbar: {
              show: false
            }
          },
          colors: ['#10b981', '#3b82f6', '#ef4444'],
          xaxis: {
            categories: ['Donasi', 'Zakat', 'Infaq/Operasional']
          }
        }
      };
      
      setChartData(chartConfig);
    } catch (error) {
      console.error('Error fetching finance data:', error);
      setFinanceData([]);
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
      await Promise.all([fetchStats(), fetchFinanceData()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Refresh data setiap 30 detik
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      fetchStats();
      fetchFinanceData();
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

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <div className="p-6 space-y-8">
        {loading && (
          <div className="fixed inset-0 bg-white/75 dark:bg-gray-900/75 flex items-center justify-center z-50 transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
          </div>
        )}
        
        {/* Header Section dengan gaya rounded seperti InformasiTable */}
        <div className="rounded-[10px] bg-white dark:bg-gray-800 shadow-1 dark:shadow-card border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Assalamu'alaikum, Admin! 🕌
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300">
                Selamat datang di Dashboard Sistem Informasi Masjid
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Data akan otomatis terupdate setiap 30 detik
              </p>
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

        {/* Finance Section dengan rounded style */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Finance Cards */}
          <div className="rounded-[10px] bg-white dark:bg-gray-800 shadow-1 dark:shadow-card border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Laporan Keuangan</h2>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Status keuangan masjid bulan ini</p>
              </div>
            </div>

            <div className="space-y-6">
              {financeData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={`${item.category}-${animationKey}`}
                    className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 rounded-xl border border-gray-100 dark:border-gray-600 hover:shadow-md dark:hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent 
                          className={`w-5 h-5 ${
                            item.category === 'Operasional' ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-500 dark:text-emerald-400'
                          } transition-colors duration-300`} 
                        />
                        <span className="font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-800 dark:text-white transition-colors duration-300">
                          {formatCurrency(item.amount)}
                        </span>
                        {item.target && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                            Target: {formatCurrency(item.target)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                        <span>Progress</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden transition-colors duration-300">
                        <div 
                          className={`h-full ${item.color} rounded-full relative transition-all duration-2000 ease-out`}
                          style={{
                            width: `${item.percentage}%`
                          }}
                        >
                          <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Section */}
          <div className="rounded-[10px] bg-white dark:bg-gray-800 shadow-1 dark:shadow-card border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Grafik Keuangan</h2>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Perbandingan pemasukan, target & pengeluaran</p>
              </div>
            </div>

            <div className="w-full">
              {chartData.options && chartData.series && chartData.series.length > 0 && (
                <div className="space-y-4">
                  {/* Chart Legend Custom */}
                  <div className="flex justify-center space-x-6 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Pemasukan</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Target</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Pengeluaran</span>
                    </div>
                  </div>

                  {/* Simplified Bar Chart */}
                  <div className="space-y-4">
                    {chartData.series[0]?.data?.map((value, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300">
                          <span>{chartData.options?.xaxis.categories[index]}</span>
                          <span>{formatCurrency(value)}</span>
                        </div>
                        <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden transition-colors duration-300">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-lg transition-all duration-1000 ease-out relative"
                            style={{
                              width: `${(value / Math.max(...(chartData.series[0]?.data || [0]), ...(chartData.series[1]?.data || [0]))) * 100}%`
                            }}
                          >
                            <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-300">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${chartData.series[1]?.data?.[index] ? (chartData.series[1].data[index] / Math.max(...(chartData.series[1].data || [0]))) * 100 : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 transition-colors duration-300">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-colors duration-300" />
                        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200 transition-colors duration-300">Total Pemasukan</span>
                      </div>
                      <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 transition-colors duration-300">
                        {formatCurrency(chartData.series[0]?.data?.reduce((a, b) => a + b, 0) || 0)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800 transition-colors duration-300">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400 transition-colors duration-300" />
                        <span className="text-sm font-medium text-rose-800 dark:text-rose-200 transition-colors duration-300">Total Pengeluaran</span>
                      </div>
                      <p className="text-lg font-bold text-rose-700 dark:text-rose-300 transition-colors duration-300">
                        {formatCurrency(12300000)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;