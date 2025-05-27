import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setAuthToken } from '../services/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ||
           (location.pathname === '/' && path === '/dashboard');
  };

  return (
    <div className="h-screen w-64 bg-blue-600 text-white flex flex-col justify-between fixed top-0 left-0 shadow-xl z-30 overflow-y-auto">
      {/* Stable sidebar - no toggle button */}

      {/* Logo and title */}
      <div>
        <div className="p-6 border-b border-blue-500">
          <div className="flex items-center justify-center">
            <div className="bg-white p-3 rounded-xl shadow-lg">
              <span className="text-blue-600 text-lg font-bold">CR</span>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-white">Car Repair</h3>
              <p className="text-sm text-blue-200 mt-1">Management System</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-blue-500">
          <div className="flex items-center">
            <div className="bg-white h-10 w-10 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-blue-600 font-bold text-sm">{user?.username?.substring(0, 2).toUpperCase() || 'US'}</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-white">{user?.fullName || user?.username}</p>
              <p className="text-xs text-blue-200">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <ul className="space-y-3">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-white text-blue-600 font-semibold shadow-md'
                    : 'hover:bg-blue-700 text-white hover:shadow-md'
                }`}
              >
                <span className="text-sm font-bold mr-3 w-6">DSH</span>
                <span className="text-sm">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/cars"
                className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                  isActive('/cars')
                    ? 'bg-white text-blue-600 font-semibold shadow-md'
                    : 'hover:bg-blue-700 text-white hover:shadow-md'
                }`}
              >
                <span className="text-sm font-bold mr-3 w-6">CAR</span>
                <span className="text-sm">Cars</span>
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                  isActive('/services')
                    ? 'bg-white text-blue-600 font-semibold shadow-md'
                    : 'hover:bg-blue-700 text-white hover:shadow-md'
                }`}
              >
                <span className="text-sm font-bold mr-3 w-6">SVC</span>
                <span className="text-sm">Services</span>
              </Link>
            </li>
            <li>
              <Link
                to="/service-records"
                className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                  isActive('/service-records')
                    ? 'bg-white text-blue-600 font-semibold shadow-md'
                    : 'hover:bg-blue-700 text-white hover:shadow-md'
                }`}
              >
                <span className="text-sm font-bold mr-3 w-6">REC</span>
                <span className="text-sm">Records</span>
              </Link>
            </li>
            <li>
              <Link
                to="/reports"
                className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                  isActive('/reports')
                    ? 'bg-white text-blue-600 font-semibold shadow-md'
                    : 'hover:bg-blue-700 text-white hover:shadow-md'
                }`}
              >
                <span className="text-sm font-bold mr-3 w-6">RPT</span>
                <span className="text-sm">Reports</span>
              </Link>
            </li>


          </ul>
        </div>
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-white border-opacity-20">
        <button
          onClick={handleLogout}
          className="flex items-center py-3 px-4 rounded-xl bg-white text-blue-900 hover:bg-blue-50 transition-all duration-200 w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <span className="text-sm font-bold mr-3 w-6">OUT</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;