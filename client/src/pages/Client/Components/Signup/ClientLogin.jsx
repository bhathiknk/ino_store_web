import React from "react";
import ClientFooter from "../Footer/ClientFooter";
import ClientNavBar from "../Nav/ClientNabBar";
import { useNavigate } from "react-router-dom";


export default function ClientLogin() {

  const navigate = useNavigate();

 const navigateToSignUpPage = () => {
    navigate("/client-signup");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ClientNavBar/>
      <main className="flex-grow flex items-center justify-center mt-12 lg:mt-16"> {/* Added margin-top here */}
        <div className="flex w-full max-w-4xl mx-auto p-8 lg:p-12 bg-white shadow-lg rounded-lg">
          <div className="hidden lg:block lg:w-1/2 lg:pr-8">
            <img
              src="https://placehold.co/800x/667fff/ffffff.png?text=Your+Image&font=Montserrat"
              alt="Placeholder Image"
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          <div className="w-full lg:w-1/2 lg:pl-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Login</h1>
            <form action="#" method="POST" className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-gray-700 font-medium">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-gray-700 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
                  autoComplete="off"
                />
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="text-blue-500"
                />
                <label htmlFor="remember" className="text-gray-700 ml-2">
                  Remember Me
                </label>
              </div>

              <div className="text-blue-500">
                <a href="#" className="hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-3 px-4 w-full transition duration-300 ease-in-out"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center text-gray-600">
              <span>Don't have an account?</span>
              <a href="#" className="text-blue-500 font-medium hover:underline ml-1" onClick={navigateToSignUpPage}>
                Sign up Here
              </a>
            </div>
          </div>
        </div>
      </main>
      <ClientFooter />
    </div>
  );
}
