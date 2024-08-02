import React, { useState } from 'react';
import ClientNavBar from "../Nav/ClientNabBar";
import ClientFooter from "../Footer/ClientFooter";
import GoogleIcon from "../../Images/Login/google.svg";
import coverimg from "../../Images/Login/coverimg.jpg";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function ClientSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', formData);
      // Handle success, e.g., navigate to another page or show a success message
      navigate('/client-login'); // Navigate to login page after successful signup
    } catch (err) {
      setError(err.response.data.message || 'An error occurred');
    }
  };

  const navigateToLoginPage = () => {
    navigate("/client-login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ClientNavBar />
      <main className="flex-grow flex items-center justify-center py-6">
        <div className="flex w-full max-w-screen-lg mx-auto h-auto">
          {/* Image Section */}
          <div className="relative w-1/2 h-auto hidden lg:flex rounded-l-lg overflow-hidden">
            <div className="absolute top-1/4 left-8 p-4">
              <h1 className="text-3xl text-white font-bold mb-4">
                Welcome To InoWeb
              </h1>
              <p className="text-lg text-white">
                Start for free and get attractive offers and products
              </p>
            </div>
            <img
              src={coverimg}
              alt="Signup Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-1/2 bg-white p-6 lg:px-16 lg:py-12 flex flex-col justify-center rounded-r-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4 text-[#060606]">
              Sign Up
            </h1>
            <p className="text-sm mb-4 text-gray-600">
              Welcome! Please enter your details to create an account.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 transition duration-300"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 transition duration-300"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 transition duration-300"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-500"
                  />
                  <p className="text-sm ml-2 text-gray-700">Agrree terms and conditions.</p>
                </div>
                <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                  Terms & Conditions
                </a>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 bg-slate-700 text-white font-semibold rounded-md  hover:bg-[#050505] hover:shadow-md transition duration-300"
              >
                Sign Up
              </button>
              <div className="relative flex items-center justify-center mt-4">
                <div className="absolute inset-x-0 h-[1px] bg-gray-300" />
                <p className="relative text-sm bg-white px-2 text-gray-600">Or</p>
              </div>
              <button className="w-full py-2 px-3 bg-white border border-gray-300 text-[#060606] font-semibold rounded-md hover:shadow-md flex items-center justify-center mt-2 hover:bg-gray-100 transition duration-300">
                <img src={GoogleIcon} alt="Google Icon" className="h-5 mr-2" />
                Continue with Google
              </button>
            </form>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="#" className="font-semibold text-blue-600 hover:underline" onClick={navigateToLoginPage}>
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <ClientFooter />
    </div>
  );
}
