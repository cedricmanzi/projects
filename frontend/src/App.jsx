import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cars from './pages/Cars';
import Services from './pages/Services';
import ServiceRecords from './pages/ServiceRecords';
import Reports from './pages/Reports';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoutes';
import { setAuthToken } from './services/api';

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin', 'Mechanic']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service-records" element={<ServiceRecords />} />
          <Route path="/reports" element={<Reports />} />
          {/* Default redirect to dashboard */}
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;