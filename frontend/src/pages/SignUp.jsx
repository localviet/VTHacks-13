// src/pages/SignUpPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Sprout } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

const SignUpPage = () => {
  // State to manage the header's appearance on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  const [platform, setPlatform] = useState("Instagram");
  const [open, setOpen] = useState(false);

  const platforms = ["Instagram", "TikTok", "YouTube"];
  // Effect to add and clean up the scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true if user has scrolled more than 10px
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* --- Header --- */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Sprout className="w-7 h-7 text-red-500" />
            <span className="text-2xl font-bold text-gray-900">Ignite</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/signin" className="text-gray-600 hover:text-black transition-colors">Sign In</Link>
            <Link to="/signup" className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-all">Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* --- Sign-Up Form Section --- */}
      <main className="flex flex-col items-center justify-center min-h-screen pt-24 pb-12 px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
          {/* Form Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
            <p className="mt-2 text-gray-600">Join Ignite to spark your next big idea.</p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="sr-only">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Full Name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
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
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Password"
                />
              </div>
            </div>
            {/* Username Input with Platform Selector */}
            <div>
                <div className="flex gap-2">
                <div className="relative">
                    <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center justify-between w-32 rounded-lg border border-gray-300 py-2.5 px-3 bg-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                    {platform}
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    {open && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        {platforms.map((p) => (
                        <button
                            key={p}
                            onClick={() => {setPlatform(p); setOpen(false);}}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                            {p}
                        </button>
                        ))}
                    </div>
                    )}
                </div>

                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                    <input
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="username"
                    />
                </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-black py-3 font-semibold text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
            >
              Create Account
            </button>
          </form>




          {/* Sign In Link */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-red-500 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;