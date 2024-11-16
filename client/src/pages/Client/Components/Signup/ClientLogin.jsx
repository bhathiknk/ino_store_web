import React, { useState } from "react";
import ClientFooter from "../Footer/ClientFooter";
import ClientNavBar from "../Nav/ClientNabBar";
import GoogleIcon from "../../Images/Login/google.svg";
import coverimg from "../../Images/Login/coverimg.jpg";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function ClientLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [userType, setUserType] = useState('buyer'); // State for user type
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserTypeChange = (e) => {
    const selectedUserType = e.target.value;
    setUserType(selectedUserType);
    if (selectedUserType === 'seller') {
      // Redirect to admin signup page if "Seller" is selected
      navigate('/signin');
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (userType === 'buyer') {
  //     try {
  //       const response = await axios.post('http://localhost:5000/api/users/signin', formData);
  //       // Handle success, e.g., navigate to client dashboard
  //       localStorage.setItem('userToken', response.data.token); // Save token to local storage
  //       navigate('/'); // Navigate to client dashboard after successful login
  //     } catch (err) {
  //       setError(err.response.data.message || 'An error occurred');
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userType === 'buyer') {
        try {
            const response = await axios.post('http://localhost:5000/api/users/signin', formData);
            
            const userData = response.data; // User data returned from the server
            localStorage.setItem('user', JSON.stringify(userData)); // Save the entire user object in local storage
            
            navigate('/'); // Redirect after successful login
        } catch (err) {
            setError(err.response.data.message || 'An error occurred');
        }
    }
};

  const navigateToSignUpPage = () => {
    navigate("/client-signup");
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
            <div className="flex items-center mb-4">
              <h1 className="text-2xl font-semibold mb-4 text-[#060606]">
                Login
              </h1>
              <select
                value={userType}
                onChange={handleUserTypeChange}
                className="ml-10 w-24 py-1 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none focus:border-blue-500 transition duration-300"
              >
                <option value="buyer" className="">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            <p className="text-sm mb-4 text-gray-600">
              Welcome! Please enter your details to Login.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                  <p className="text-sm ml-2 text-gray-700">Remember me</p>
                </div>
                <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                  Forgot Password
                </a>
              </div>
              {userType === 'buyer' && (
                <button
                  type="submit"
                  className="w-full py-2 px-3 bg-slate-700 text-white font-semibold rounded-md hover:bg-[#050505] hover:shadow-md transition duration-300"
                >
                  Login
                </button>
              )}
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
                Don't have an account?{" "}
                <a href="#" className="font-semibold text-blue-600 hover:underline" onClick={navigateToSignUpPage}>
                  Sign Up
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
