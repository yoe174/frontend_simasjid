'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
// import GoogleButton from '@/components/admin/login/GoogleButton';
import Logo from '@/components/admin/login/Logo';
import { login } from '@/services/auth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State loading

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);  // mulai loading

    try {
      await login(email, password);
      router.push('/admin');
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false); // selesai loading, baik berhasil atau gagal
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <Logo />
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
        {/* <GoogleButton /> */}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4  text-slate-400">Masukkan akun anda disini</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="text-red-500 text-sm text-center">{errorMsg}</div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-slate-300">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center">
            <span className="text-slate-400 text-sm">Don't have an account? </span>
            <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
