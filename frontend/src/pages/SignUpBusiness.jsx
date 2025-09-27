// src/pages/SignUpPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Sprout } from 'lucide-react';

const SignUpPage = () => {
  // State to manage the header's appearance on scroll
  const [isScrolled, setIsScrolled] = useState(false);

  // Business form state (single-step)
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    website: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
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

      {/* --- Business Sign-Up Form Section --- */}
      <main className="flex flex-col items-center justify-center min-h-screen pt-24 pb-12 px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
          {/* Form Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Your Business Account</h1>
            <p className="mt-2 text-gray-600">Register your business to join Ignite — share your website and grow your presence.</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              const { businessName, email, password, website } = formData;
              if (!businessName || !email || !password) {
                setError('Please provide business name, email and password.');
                setLoading(false);
                return;
              }

              const res = await fetch('/api/business/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessName, email, password, website }),
              });

              if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(text || `Server returned ${res.status}`);
              }

              setSuccess(true);
              // clear form (optional)
              setFormData({ businessName: '', email: '', password: '', website: '' });
            } catch (err) {
              setError(err.message || 'Registration failed.');
            } finally {
              setLoading(false);
            }
          }}>
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="sr-only">Business Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Business name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="business@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Password"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="sr-only">Business website</label>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="https://www.yourbusiness.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black py-3 font-semibold text-white transition-all hover:bg-gray-800 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
            >
              {loading ? 'Submitting...' : 'Create Business Account'}
            </button>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">Business account created — check your email.</div>}
          </form>




          {/* Sign In Link */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-red-500 hover:underline">
              Sign In
            </Link>
          </div>
          {/* Business? link */}
          <div className="text-center text-sm text-gray-600">
            Have a business?{' '}
            <Link to="/business/signup" className="font-medium text-red-500 hover:underline">
              Create a Business Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;