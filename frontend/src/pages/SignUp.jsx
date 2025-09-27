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
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    username: '',
    videolinks: {}
  });
  const [step, setStep] = useState(1); // step 1 = basic info, step 2 = follow-ups
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

      {/* --- Sign-Up Form Section --- */}
      <main className="flex flex-col items-center justify-center min-h-screen pt-24 pb-12 px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
          {/* Form Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
            <p className="mt-2 text-gray-600">Join Ignite to spark your next big idea.</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <>
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
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                        type="button"
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
                              type="button"
                              onClick={() => { setPlatform(p); setOpen(false); }}
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
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    // basic validation example
                    if (!formData.fullName || !formData.email || !formData.password) {
                      setError('Please fill in name, email and password.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full rounded-lg bg-black py-3 font-semibold text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                >
                  Next
                </button>
              </>
            )}

            {step === 2 && (
              <>
                {/* Follow-up: three video link inputs for Instagram, TikTok, YouTube */}
                <div>
                  <label htmlFor="igLink" className="block text-sm font-medium text-gray-700 mb-2">Video link</label>
                  <input
                    id="igLink"
                    type="url"
                    placeholder="https://www.instagram.com/..."
                    value={formData.igLink}
                    onChange={(e) => setFormData({ ...formData, igLink: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="tiktokLink" className="block text-sm font-medium text-gray-700 mb-2">Video link</label>
                  <input
                    id="tiktokLink"
                    type="url"
                    placeholder="https://www.tiktok.com/..."
                    value={formData.tiktokLink}
                    onChange={(e) => setFormData({ ...formData, tiktokLink: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="ytLink" className="block text-sm font-medium text-gray-700 mb-2">Video link</label>
                  <input
                    id="ytLink"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.ytLink}
                    onChange={(e) => setFormData({ ...formData, ytLink: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      setError(null);
                      setLoading(true);
                      try {
                        // Merge the three link inputs into videolinks object on submit
                        const mergedVideoLinks = {
                          ...(formData.videolinks || {}),
                          instagram: formData.igLink || '',
                          tiktok: formData.tiktokLink || '',
                          youtube: formData.ytLink || '',
                        };

                        // Update local formData so UI state reflects merged videolinks
                        setFormData((prev) => ({ ...prev, videolinks: mergedVideoLinks }));

                        const payload = { ...formData, videolinks: mergedVideoLinks };

                        // Example backend call - change endpoint to match your API
                        const res = await fetch('/api/auth/register', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ ...payload, platform }),
                        });

                        if (!res.ok) {
                          const text = await res.text().catch(() => '');
                          throw new Error(text || `Server returned ${res.status}`);
                        }
                        setSuccess(true);
                      } catch (err) {
                        setError(err.message || 'Registration failed.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="flex-1 rounded-lg bg-black py-3 font-semibold text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                  >
                    {loading ? 'Submitting...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}

            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">Account created — check your email (or adjust endpoint)</div>}
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
            <Link to="/signin" className="font-medium text-red-500 hover:underline">
              Create a Business Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;