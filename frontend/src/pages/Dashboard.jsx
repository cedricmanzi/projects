import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [stats, setStats] = useState({
    totalCars: 0,
    totalServices: 0,
    totalServiceRecords: 0,
    totalRevenue: 0,
    recentRecords: [],
    revenueByService: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsername(user.username);
      setFullName(user.fullName || '');
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel for better performance
      const [carsRes, servicesRes, recordsRes] = await Promise.all([
        api.get('/api/cars'),
        api.get('/api/services'),
        api.get('/api/service-records')
      ]);

      // Calculate total revenue
      const totalRevenue = recordsRes.data.reduce(
        (sum, record) => sum + parseFloat(record.amountPaid || 0),
        0
      );

      // Get recent service records (last 5)
      const recentRecords = [...recordsRes.data]
        .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
        .slice(0, 5);

      // Calculate revenue by service type
      const revenueByService = {};
      recordsRes.data.forEach(record => {
        const serviceName = record.Service?.serviceName || 'Unknown';
        if (!revenueByService[serviceName]) {
          revenueByService[serviceName] = 0;
        }
        revenueByService[serviceName] += parseFloat(record.amountPaid || 0);
      });

      setStats({
        totalCars: carsRes.data.length,
        totalServices: servicesRes.data.length,
        totalServiceRecords: recordsRes.data.length,
        totalRevenue,
        recentRecords,
        revenueByService
      });

      setError(null);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Unable to fetch dashboard data. Using cached data if available.');

      // Use cached data if available
      if (stats.totalCars === 0) {
        setStats({
          totalCars: 0,
          totalServices: 6,
          totalServiceRecords: 0,
          totalRevenue: 0,
          recentRecords: [],
          revenueByService: {}
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-700 mb-2">Welcome back, {fullName || username}!</h1>
            <p className="text-lg text-gray-600">
              Car Repair Management Dashboard
            </p>
          </div>
          <div className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md">
            <p className="text-sm font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-lg" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900 mb-4"></div>
            <p className="text-blue-900 text-lg font-medium">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Cars</h3>
                  <p className="text-3xl font-bold text-gray-700 mt-2">{stats.totalCars || 0}</p>
                  <p className="text-sm text-gray-500 mt-1">Registered vehicles</p>
                </div>
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-white">CAR</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Services</h3>
                  <p className="text-3xl font-bold text-gray-700 mt-2">{stats.totalServices || 0}</p>
                  <p className="text-sm text-gray-500 mt-1">Available services</p>
                </div>
                <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-white">SVC</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Service Records</h3>
                  <p className="text-3xl font-bold text-gray-700 mt-2">{stats.totalServiceRecords || 0}</p>
                  <p className="text-sm text-gray-500 mt-1">Completed repairs</p>
                </div>
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-white">REC</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Revenue</h3>
                  <p className="text-3xl font-bold text-gray-700 mt-2">{Number(stats.totalRevenue || 0).toLocaleString()} RWF</p>
                  <p className="text-sm text-gray-500 mt-1">Total earnings</p>
                </div>
                <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-white">REV</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">
              Quick Access
            </h2>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <Link
                  to="/cars"
                  className="flex flex-col items-center p-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-3">
                    <span className="text-sm font-bold">CAR</span>
                  </div>
                  <span className="text-sm font-semibold text-center">Cars</span>
                </Link>

                <Link
                  to="/services"
                  className="flex flex-col items-center p-4 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-3">
                    <span className="text-sm font-bold">SVC</span>
                  </div>
                  <span className="text-sm font-semibold text-center">Services</span>
                </Link>

                <Link
                  to="/service-records"
                  className="flex flex-col items-center p-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-3">
                    <span className="text-sm font-bold">REC</span>
                  </div>
                  <span className="text-sm font-semibold text-center">Records</span>
                </Link>

                <Link
                  to="/reports"
                  className="flex flex-col items-center p-4 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-3">
                    <span className="text-sm font-bold">RPT</span>
                  </div>
                  <span className="text-sm font-semibold text-center">Reports</span>
                </Link>


              </div>
            </div>
          </div>



                {/* Recent Service Records */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-blue-900">
                      Recent Service Records
                    </h3>
                    <Link
                      to="/service-records"
                      className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors shadow-md"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg border-2 border-blue-900 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-blue-200">
                        <thead className="bg-blue-900">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Car</th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Service</th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-blue-100">
                          {stats.recentRecords && stats.recentRecords.length > 0 ? (
                            stats.recentRecords.map((record, index) => (
                              <tr
                                key={record.recordNumber || `record-${Math.random()}`}
                                className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}
                              >
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm font-medium text-blue-900">
                                    {record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : 'N/A'}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xs">
                                      {(record.Car?.plateNumber || record.plateNumber || 'N/A').substring(0, 2)}
                                    </div>
                                    <div className="ml-3">
                                      <div className="text-sm font-semibold text-blue-900">{record.Car?.plateNumber || record.plateNumber || 'N/A'}</div>
                                      <div className="text-xs text-blue-700">{record.Car?.model || ''}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className="px-3 py-1 text-sm bg-blue-900 text-white rounded-full font-medium">
                                    {record.Service?.serviceName || record.serviceCode || 'N/A'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                                    {Number(record.amountPaid || 0).toLocaleString()} RWF
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-4 py-12 text-center">
                                <div className="flex flex-col items-center">
                                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-lg font-bold text-blue-900">REC</span>
                                  </div>
                                  <p className="text-lg font-semibold mb-2 text-blue-900">No recent service records</p>
                                  <p className="text-sm text-blue-700 max-w-md text-center mb-4">Add service records to track repairs and generate reports</p>
                                  <Link
                                    to="/service-records"
                                    className="bg-blue-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
                                  >
                                    Add Service Record
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-4">
                    Recent Activities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 border-l-4 border-blue-900 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          CAR
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-900">New car added</p>
                          <p className="text-xs text-blue-700">Today, 10:30 AM</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border-l-4 border-blue-900 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-white border-2 border-blue-900 text-blue-900 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          SVC
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-900">Service completed</p>
                          <p className="text-xs text-blue-700">Yesterday, 3:45 PM</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-900 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          RPT
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-900">Report generated</p>
                          <p className="text-xs text-blue-700">May 20, 2023</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border-l-4 border-blue-900 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-white border-2 border-blue-900 text-blue-900 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          PAY
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-900">Payment received</p>
                          <p className="text-xs text-blue-700">May 19, 2023</p>
                        </div>
                      </div>
                    </div>
                  </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
