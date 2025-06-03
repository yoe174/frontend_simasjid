// pages/login.tsx atau app/login/page.tsx
import React from 'react';
import LoginBackground from '@/components/admin/login/LoginBackground';
import LoginForm from '@/components/admin/login/LoginForm';
import WelcomeSection from '@/components/admin/login/WelcomeSection';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <LoginBackground />
      
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <LoginForm />
        </div>
        
        {/* Right Side - Welcome Section */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
          <WelcomeSection />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;