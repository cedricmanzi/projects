import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ||
           (location.pathname === '/' && path === '/dashboard');
  };

  return (
    <div className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center group">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center mr-3 shadow-md group-hover:shadow-lg transition-all duration-200">
                <span className="text-blue-600 text-lg font-bold">CR</span>
              </div>
              <span className="text-xl font-semibold">Car Repair System</span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-2">
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white hover:bg-blue-700 hover:shadow-md'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/cars"
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  isActive('/cars')
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white hover:bg-blue-700 hover:shadow-md'
                }`}
              >
                Cars
              </Link>
              <Link
                to="/services"
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  isActive('/services')
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white hover:bg-blue-700 hover:shadow-md'
                }`}
              >
                Services
              </Link>
              <Link
                to="/service-records"
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  isActive('/service-records')
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white hover:bg-blue-700 hover:shadow-md'
                }`}
              >
                Records
              </Link>
              <Link
                to="/reports"
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  isActive('/reports')
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white hover:bg-blue-700 hover:shadow-md'
                }`}
              >
                Reports
              </Link>
              {user?.role === 'Admin' && (
                <Link
                  to="/mechanics"
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    isActive('/mechanics')
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-white hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  Mechanics
                </Link>
              )}
            </nav>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 bg-blue-700 px-4 py-2 rounded-xl shadow-md">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{user?.fullName || user?.username}</p>
                <p className="text-xs text-blue-200">{user?.role}</p>
              </div>
              <div className="h-8 w-8 bg-white rounded-xl flex items-center justify-center shadow-md">
                <span className="text-blue-600 text-sm font-bold">
                  {(user?.fullName || user?.username)?.substring(0, 1)?.toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className="md:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 border-t border-blue-500">
        <nav className="grid grid-cols-2 gap-3">
          <Link
            to="/dashboard"
            className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-center ${
              isActive('/dashboard')
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-white hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/cars"
            className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-center ${
              isActive('/cars')
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-white hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            Cars
          </Link>
          <Link
            to="/services"
            className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-center ${
              isActive('/services')
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-white hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            Services
          </Link>
          <Link
            to="/service-records"
            className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-center ${
              isActive('/service-records')
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-white hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            Records
          </Link>
          <Link
            to="/reports"
            className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-center ${
              isActive('/reports')
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-white hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            Reports
          </Link>
          {user?.role === 'Admin' && (
            <Link
              to="/mechanics"
              className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-center ${
                isActive('/mechanics')
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-blue-700 hover:shadow-md'
              }`}
            >
              Mechanics
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
