import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle form data changes
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission (login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // For testing purposes, simulate a successful login
      // Comment this out when the backend is working
      const user = JSON.parse(localStorage.getItem('user')) || {
        id: 1,
        username: formData.username,
        role: 'Mechanic',
        fullName: formData.username
      };

      // Check if username is 'admin' for admin role
      if (formData.username === 'admin') {
        user.role = 'Admin';
        user.fullName = 'System Administrator';
      }

      // Generate a fake token
      const token = 'fake_token_' + Math.random().toString(36).substring(2);

      // Store token and user info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set the authorization token in axios headers
      setAuthToken(token);

      // Redirect to dashboard
      navigate('/dashboard');

      // Uncomment this when the backend is working
      /*
      const res = await api.post('/api/users/login', formData);
      const { token, user } = res.data;

      // Store token and user info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set the authorization token in axios headers
      setAuthToken(token);

      // Redirect to dashboard
      navigate('/dashboard');
      */
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Backend server might be down.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-600 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-white flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="mx-auto h-32 w-32 bg-blue-600 rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <div className="text-white text-5xl font-bold">CR</div>
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Car Repair System
          </h1>
          <p className="text-xl text-blue-700 mb-8">
            Professional Management Platform
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-900 rounded-full mr-4"></div>
              <span className="text-blue-800">Manage vehicle repairs efficiently</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-900 rounded-full mr-4"></div>
              <span className="text-blue-800">Track service records seamlessly</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-900 rounded-full mr-4"></div>
              <span className="text-blue-800">Generate comprehensive reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-blue-900 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto h-24 w-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-xl">
              <div className="text-blue-900 text-3xl font-bold">CR</div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Car Repair System
            </h2>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Welcome Back</h3>
              <p className="text-blue-700">Sign in to continue to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full px-4 py-4 border-2 border-blue-200 rounded-xl shadow-sm placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200"
                />
                <label
                  htmlFor="username"
                  className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-blue-900 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-400 peer-placeholder-shown:top-4 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:left-4 peer-focus:text-sm peer-focus:text-blue-900"
                >
                  Username
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full px-4 py-4 border-2 border-blue-200 rounded-xl shadow-sm placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200"
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-blue-900 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-400 peer-placeholder-shown:top-4 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:left-4 peer-focus:text-sm peer-focus:text-blue-900"
                >
                  Password
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-5 w-5 text-blue-900 focus:ring-blue-900 border-blue-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-blue-800 font-medium">
                    Keep me signed in
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-900 hover:text-blue-700 transition-colors underline">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-blue-100" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-blue-600 font-medium">New to our platform?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <a
                  href="/register"
                  className="inline-flex items-center px-6 py-3 border-2 border-blue-900 text-blue-900 font-semibold rounded-xl hover:bg-blue-900 hover:text-white transition-all duration-200 transform hover:scale-105"
                >
                  Create New Account
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="flex justify-center space-x-6 text-white opacity-80 text-sm">
              <span>Secure</span>
              <span>•</span>
              <span>Professional</span>
              <span>•</span>
              <span>Reliable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
