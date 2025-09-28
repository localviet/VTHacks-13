// src/pages/SignInPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const solveJWT = async (token) => {
  try {
    const response = await axios.request({
      url: `${import.meta.env.VITE_API_URL}/api/solveJWT`,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error solving JWT:", error);
    return null;
  }
};

const SignInPage = () => {
  const navigate = useNavigate();
  // State to manage the header's appearance on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // Effect to add and clean up the scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true if user has scrolled more than 10px
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* --- Header --- */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-sm shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Sprout className="w-7 h-7 text-red-500" />
            <span className="text-2xl font-bold text-gray-900">Ignite</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              to="/signin"
              className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* --- Sign-In Form Section --- */}
      <main className="flex flex-col items-center justify-center min-h-screen pt-24 pb-12 px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
          {/* Form Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
            <p className="mt-2 text-gray-600">Sign in to continue to Ignite.</p>
          </div>

          {/* Form */}
          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              axios
                .request({
                  url: `${import.meta.env.VITE_API_URL}/api/login`,
                  method: "get",
                  params: formData,
                })
                .then((res) => {
                  console.log(res.data);
                  localStorage.setItem("accessToken", res.data.accessToken);
                  localStorage.setItem("refreshToken", res.data.refreshToken);
                  // Redirect to dashboard or another page after successful login
                  console.log(res.data.accessToken);
                  solveJWT(res.data.accessToken).then((data) => {
                    console.log(data);
                    if (data.decoded.userType === "CorpUser") {
                      navigate("/business/dashboard");
                    } else {
                      navigate("/dashboard");
                    }
                  });
                })
                .catch((err) => {
                  console.error(err);
                });
            }}
          >
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Email address"
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Password"
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm font-medium text-red-500 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-black py-3 font-semibold text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="font-medium text-red-500 hover:underline">
              Sign Up
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
