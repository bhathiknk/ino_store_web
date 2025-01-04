import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/signin',
        {
          email,
          password,
        }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('adminId', response.data._id);

      toast.success('Signin successful!', {
        position: 'top-right',
        autoClose: 3000,
      });

      setTimeout(() => navigate('/Admin/ProductPage'), 2000);
    } catch (error) {
      toast.error('Signin failed! Invalid credentials.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-2xl bg-white p-12 rounded-2xl shadow-2xl">
        <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-10">
          Admin Signin
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="mt-3 w-full px-5 py-4 text-lg border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="mt-3 w-full px-5 py-4 text-lg border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-600 transition duration-300"
          >
            Sign In
          </button>
        </form>

        {/* Toast Notification */}
        <ToastContainer />

        {/* Additional Info */}
        <div className="mt-10 text-center">
          <p className="text-lg text-gray-600">
            Forgot your password?{' '}
            <a
              href="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Reset it here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
