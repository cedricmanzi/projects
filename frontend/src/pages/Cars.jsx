import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    plateNumber: '',
    type: '',
    model: '',
    manufacturingYear: '',
    driverPhone: '',
    mechanicName: ''
  });
  const [editingPlateNumber, setEditingPlateNumber] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nameErrors, setNameErrors] = useState({});

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/cars');
      setCars(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Unable to load cars. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Validation function for names
  const validateName = (name, fieldName) => {
    if (!name) return '';

    // Check if name starts with a letter (alphabetic character)
    const startsWithLetter = /^[a-zA-Z]/.test(name);

    if (!startsWithLetter) {
      return `${fieldName} must start with a letter`;
    }

    // Check if name contains only letters, spaces, and common punctuation
    const validNamePattern = /^[a-zA-Z][a-zA-Z\s\-'\.]*$/;

    if (!validNamePattern.test(name)) {
      return `${fieldName} can only contain letters, spaces, hyphens, apostrophes, and periods`;
    }

    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({ ...formData, [name]: value });

    // Validate name fields
    if (name === 'mechanicName') {
      const error = validateName(value, 'Mechanic name');
      setNameErrors(prev => ({ ...prev, [name]: error }));
    }

    // Clear general errors when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Check for validation errors
    const mechanicNameError = validateName(formData.mechanicName, 'Mechanic name');

    if (mechanicNameError) {
      setNameErrors(prev => ({ ...prev, mechanicName: mechanicNameError }));
      setError('Please fix the validation errors before submitting.');
      setSubmitting(false);
      return;
    }

    try {
      if (editingPlateNumber) {
        await api.put(`/api/cars/${editingPlateNumber}`, formData);
        setSuccess('Car updated successfully');
      } else {
        await api.post('/api/cars', formData);
        setSuccess('Car added successfully');
      }

      setFormData({
        plateNumber: '',
        type: '',
        model: '',
        manufacturingYear: '',
        driverPhone: '',
        mechanicName: ''
      });
      setEditingPlateNumber(null);
      setNameErrors({});
      fetchCars();

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving car:', err);
      setError(err.response?.data?.message || 'Error saving car. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (car) => {
    setFormData({
      plateNumber: car.plateNumber,
      type: car.type,
      model: car.model,
      manufacturingYear: car.manufacturingYear,
      driverPhone: car.driverPhone,
      mechanicName: car.mechanicName
    });
    setEditingPlateNumber(car.plateNumber);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (plateNumber) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      try {
        await api.delete(`/api/cars/${plateNumber}`);
        setSuccess('Car deleted successfully');
        fetchCars();

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (err) {
        console.error('Error deleting car:', err);
        setError(err.response?.data?.message || 'Error deleting car. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      plateNumber: '',
      type: '',
      model: '',
      manufacturingYear: '',
      driverPhone: '',
      mechanicName: ''
    });
    setEditingPlateNumber(null);
    setError(null);
    setSuccess(null);
    setNameErrors({});
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-700 mb-2">Car Management</h1>
            <p className="text-lg text-gray-600">Add, edit and manage cars in the system</p>
          </div>
          <div className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md">
            <p className="text-sm font-semibold">{cars.length} {cars.length === 1 ? 'Car' : 'Cars'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p>{success}</p>
            </div>
          </div>
        </div>
      )}

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-700">
              {editingPlateNumber ? 'Edit Car Information' : 'Add New Car'}
            </h2>
            {editingPlateNumber && (
              <span className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md">
                Editing: {editingPlateNumber}
              </span>
            )}
          </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Plate Number</label>
              <input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                disabled={editingPlateNumber}
                className={`w-full p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors ${
                  editingPlateNumber ? 'bg-blue-50 cursor-not-allowed' : 'bg-white'
                }`}
                placeholder="e.g. RAD123A"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 bg-white border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors"
                placeholder="e.g. Sedan, SUV, Truck"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full p-3 bg-white border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors"
                placeholder="e.g. Toyota Corolla"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Manufacturing Year</label>
              <input
                type="number"
                name="manufacturingYear"
                value={formData.manufacturingYear}
                onChange={handleChange}
                className="w-full p-3 bg-white border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors"
                min="1900"
                max={new Date().getFullYear() + 1}
                placeholder={new Date().getFullYear().toString()}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Driver Phone</label>
              <input
                type="text"
                name="driverPhone"
                value={formData.driverPhone}
                onChange={handleChange}
                className="w-full p-3 bg-white border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors"
                placeholder="e.g. 0789123456"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Mechanic Name</label>
              <input
                type="text"
                name="mechanicName"
                value={formData.mechanicName}
                onChange={handleChange}
                className={`w-full p-3 bg-white border-2 rounded-lg focus:ring-2 transition-colors ${
                  nameErrors.mechanicName
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-blue-200 focus:ring-blue-900 focus:border-blue-900'
                }`}
                placeholder="e.g. John Doe"
                required
              />
              {nameErrors.mechanicName && (
                <p className="mt-1 text-sm text-red-600">{nameErrors.mechanicName}</p>
              )}
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (editingPlateNumber ? 'Updating...' : 'Saving...') : (editingPlateNumber ? 'Update Car' : 'Add Car')}
            </button>
            {editingPlateNumber && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-700">Car List</h2>
              <span className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md">
                {cars.length} {cars.length === 1 ? 'car' : 'cars'}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
              <span className="ml-3 text-blue-900 font-medium">Loading cars...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plate Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Model
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mechanic
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {cars.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <p className="text-lg font-medium">No cars found</p>
                        <p className="text-sm text-gray-400 mb-2">Add a new car to get started</p>
                        <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg max-w-md">
                          <p className="font-medium mb-1">Car Information Guide:</p>
                          <ul className="list-disc list-inside text-left space-y-1 text-gray-600">
                            <li>Plate Number: Enter the vehicle's license plate</li>
                            <li>Type: Vehicle category (Sedan, SUV, Truck, etc.)</li>
                            <li>Model: Make and model (Toyota Corolla, Honda CR-V, etc.)</li>
                            <li>Driver Phone: Contact number of the vehicle owner</li>
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                  ) : (
                    cars.map((car, index) => (
                      <tr key={car.plateNumber} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-blue-900">{car.plateNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {car.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {car.model}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {car.manufacturingYear}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {car.driverPhone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {car.mechanicName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(car)}
                              disabled={submitting}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(car.plateNumber)}
                              disabled={submitting}
                              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cars;
