import React from 'react';
import ClientNavBar from "../Nav/ClientNabBar";
import ClientFooter from "../Footer/ClientFooter";
import GoogleIcon from "../../Images/Login/google.svg";
import coverimg from "../../Images/Login/coverimg.jpg";

export default function ClientSignup() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ClientNavBar />
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="flex w-full max-w-screen-xl mx-auto h-screen">
          {/* Image Section */}
          <div className="relative w-1/2 h-full hidden lg:flex rounded-l-lg overflow-hidden">
            <div className="absolute top-1/4 left-10 p-4">
              <h1 className="text-4xl text-white font-bold mb-4">
                Welcome To InoWeb
              </h1>
              <p className="text-xl text-white">
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
          <div className="w-full lg:w-1/2 bg-white p-8 lg:px-20 lg:py-16 flex flex-col justify-center rounded-r-lg shadow-md">
            <h1 className="text-3xl font-semibold mb-6 text-[#060606]">
              Sign Up
            </h1>
            <p className="text-sm mb-6 text-gray-600">
              Welcome! Please enter your details to create an account.
            </p>
            <form className="space-y-6">
              <input
                type="email"
                placeholder="Email"
                className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 transition duration-300"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 transition duration-300"
              />
              <div className="flex items-center justify-between mb-6">
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
              <button
                type="submit"
                className="w-full py-3 px-4 bg-slate-700 text-white font-semibold rounded-md  hover:bg-[#050505] hover:shadow-md transition duration-300"
              >
                Sign Up
              </button>
              <button
                type="button"
                className="w-full py-3 px-4 bg-white border border-gray-300 text-[#060606] font-semibold rounded-md hover:shadow-md mt-2 hover:bg-gray-100 transition duration-300"
              >
                Login
              </button>
              <div className="relative flex items-center justify-center mt-6">
                <div className="absolute inset-x-0 h-[1px] bg-gray-300" />
                <p className="relative text-lg bg-white px-2 text-gray-600">Or</p>
              </div>
              <button className="w-full py-3 px-4 bg-white border border-gray-300 text-[#060606] font-semibold rounded-md hover:shadow-md flex items-center justify-center mt-2 hover:bg-gray-100 transition duration-300">
                <img src={GoogleIcon} alt="Google Icon" className="h-6 mr-2" />
                Continue with Google
              </button>
            </form>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="#" className="font-semibold text-blue-600 hover:underline">
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
