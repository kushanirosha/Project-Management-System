import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onToggleForm: (form: 'login' | 'register' | 'forgot') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState(''); // empty
  const [password, setPassword] = useState(''); // empty
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      } else {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (storedUser.role === 'client') {
          navigate('/client-dashboard');
        }
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#3c405b] mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#2E3453] mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2E3453] mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 py-2 px-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3c405b] text-white py-2 px-4 rounded-lg hover:bg-[#2E3453] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => onToggleForm('forgot')}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Forgot your password?
        </button>
      </div>

      <div className="mt-4 text-center">
        <span className="text-gray-600 text-sm">Don't have an account? </span>
        <button
          onClick={() => onToggleForm('register')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          Sign up
        </button>
      </div>
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>
          Powered by: {' '}
          <a
            href="https://www.ceyloncreative.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-600 hover:text-blue-500 transition-colors"
          >
            Ceylon Creative (Pvt) Ltd
          </a>
        </p>
      </div>

    </div>
  );
};

export default LoginForm;
