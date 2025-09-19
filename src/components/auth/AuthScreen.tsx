import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const AuthScreen: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<'login' | 'register' | 'forgot'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3c405b] rounded-full mb-4">
            <Palette className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#3c405b] mb-2">DesignFlow</h1>
          <p className="text-gray-600">Professional project management for designers</p>
        </div>

        {/* Form Container */}
        {currentForm === 'login' && <LoginForm onToggleForm={setCurrentForm} />}
        {currentForm === 'register' && <RegisterForm onToggleForm={setCurrentForm} />}
        {currentForm === 'forgot' && <ForgotPasswordForm onToggleForm={setCurrentForm} />}
      </div>
    </div>
  );
};

export default AuthScreen;