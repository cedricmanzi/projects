import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'Mechanic'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number and special character');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = formData;

      // For testing purposes, simulate a successful registration
      // Comment this out when the backend is working
      setSuccess('Registration successful! You can now login.');
      // Store user in localStorage for testing
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: registerData.username,
        role: registerData.role || 'Mechanic',
        fullName: registerData.fullName
      }));

      setTimeout(() => {
        navigate('/login');
      }, 2000);

      // Uncomment this when the backend is working
      /*
      const res = await api.post('/api/users/register', registerData);
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      */
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || 'Registration failed. Backend server might be down.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex">
      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="mx-auto h-32 w-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <div className="text-blue-600 text-5xl font-bold">CR</div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Join Our Platform
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Start your journey with us today
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
              <span className="text-blue-100">Quick and easy registration</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
              <span className="text-blue-100">Secure account protection</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
              <span className="text-blue-100">Instant access to dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto h-24 w-24 bg-blue-900 rounded-full flex items-center justify-center mb-4 shadow-xl">
              <div className="text-white text-3xl font-bold">CR</div>
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Join Car Repair System
            </h2>
          </div>

          {/* Registration Form */}
          <div className="bg-white border-2 border-blue-900 rounded-2xl shadow-2xl p-8 lg:p-10">

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <p className="text-sm">{success}</p>
            </div>
          )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Create Your Account</h3>
              <p className="text-blue-700">Join us and start managing your car repair business</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-4 py-4 border-2 border-blue-200 rounded-xl shadow-sm placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200"
                  />
                  <label
                    htmlFor="fullName"
                    className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-blue-900 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-400 peer-placeholder-shown:top-4 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:left-4 peer-focus:text-sm peer-focus:text-blue-900"
                  >
                    Full Name
                  </label>
                </div>

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
              </div>

              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full px-4 py-4 border-2 border-blue-200 rounded-xl shadow-sm placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200"
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-blue-900 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-400 peer-placeholder-shown:top-4 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:left-4 peer-focus:text-sm peer-focus:text-blue-900"
                >
                  Email Address
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-4 py-4 border-2 border-blue-200 rounded-xl shadow-sm placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200"
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-blue-900 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-400 peer-placeholder-shown:top-4 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:left-4 peer-focus:text-sm peer-focus:text-blue-900"
                  >
                    Confirm Password
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-r-xl">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-800 font-medium">Password Requirements:</p>
                    <p className="text-xs text-blue-700 mt-1">
                      At least 8 characters with uppercase, lowercase, number and special character
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="peer w-full px-4 py-4 border-2 border-blue-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all duration-200 bg-white appearance-none"
                >
                  <option value="Mechanic">Mechanic</option>
                  <option value="Admin">Administrator</option>
                </select>
                <label
                  htmlFor="role"
                  className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-blue-900"
                >
                  Role
                </label>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-900"></div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create My Account'
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
                  <span className="px-4 bg-white text-blue-600 font-medium">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <a
                  href="/login"
                  className="inline-flex items-center px-6 py-3 border-2 border-blue-900 text-blue-900 font-semibold rounded-xl hover:bg-blue-900 hover:text-white transition-all duration-200 transform hover:scale-105"
                >
                  Sign In Instead
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="flex justify-center space-x-6 text-blue-700 text-sm">
              <span>Professional</span>
              <span>•</span>
              <span>Secure</span>
              <span>•</span>
              <span>Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;