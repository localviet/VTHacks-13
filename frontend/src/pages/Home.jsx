import { useState, useEffect, useRef } from "react";
import RotatingText from "../components/RotatingText.jsx";
import Logo from "../components/Logo.jsx";
import { Link } from "react-router-dom";

// --- Icon Components (using SVG for portability) ---

const UsersIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ZapIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const TrendingUpIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

// --- Main App Component ---
export default function App() {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const [isScrolled, setIsScrolled] = useState(false);
  const words = [
    "Content",
    "Brand",
    "Agency",
    "Store",
    "Business",
    "Product",
    "Service",
    "Experience",
  ];
  // Effect for Navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect for fade-in animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div className="bg-white font-sans text-gray-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
        body { font-family: 'Sora', sans-serif; }
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in.fade-in-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        
        .hero-glow {
            box-shadow: 0 0 150px 50px rgba(239, 68, 68, 0.2);
        }
        .subtle-pulse {
            animation: pulse 4s infinite ease-in-out;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
        }
        .animated-gradient {
          background-size: 200% auto;
          animation: gradient-flow 4s linear infinite;
        }
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* --- Header --- */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-sm shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Logo className="w-7 h-7" />
            <span className="text-2xl font-bold text-gray-900">Ignite</span>
          </div>
          <nav className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signin"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-all"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                to="/Dashboard"
                className="text-black px-4 py-2 font-bold text-xl h transition-all border-b-2 border-transparent hover:border-black"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* --- Hero Section --- */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden">
          <video
            autoPlay
            loop
            muted
            className="absolute z-0 w-full h-full object-cover"
          >
            <source
              src="https://videos.pexels.com/video-files/853875/853875-hd_1920_1080_25fps.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 hero-glow rounded-full w-1/2 h-1/2 m-auto blur-3xl opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 subtle-pulse">
              <Logo className="w-24 h-24" alt="Ignite large logo" />
            </div>
            <h1 className="text-5xl md:text-9xl font-bold tracking-tight pb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-orange-500 animated-gradient">
              Ignite Your Content
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
              The ultimate platform connecting authentic creators with
              innovative brands.
            </p>
            <Link
              to="/signup"
              className="mt-8 bg-red-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-red-600 transition-all transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* --- Slogan Section --- */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-6 text-center">
            <h2 className="fade-in text-5xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">
              Create More.
            </h2>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-20 md:py-28 bg-gray-50/70">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="fade-in text-4xl font-bold tracking-tight">
                How It Works
              </h3>
              <p className="fade-in delay-1 text-lg text-gray-500 mt-2 max-w-2xl mx-auto">
                We make authentic collaboration seamless and powerful for
                everyone involved.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <div className="fade-in delay-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center mb-5">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-semibold mb-2">
                  Match with Brands
                </h4>
                <p className="text-gray-500">
                  Our smart algorithm connects you with brands that align with
                  your voice and values, ensuring authentic partnerships.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="fade-in delay-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-5">
                  <ZapIcon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Launch Campaigns</h4>
                <p className="text-gray-500">
                  Brands can effortlessly launch UGC campaigns, set goals, and
                  manage creator submissions all in one place.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="fade-in delay-3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-teal-100 text-teal-600 w-12 h-12 rounded-lg flex items-center justify-center mb-5">
                  <TrendingUpIcon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Track & Grow</h4>
                <p className="text-gray-500">
                  Access real-time analytics to track campaign performance and
                  measure the impact of your creator collaborations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-6 text-center">
            <div className="fade-in max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Ready to Ignite?
              </h2>
              <p className="text-lg text-gray-500 mt-4 mb-8">
                Join the community of forward-thinking brands and creators
                today. Signing up is free and takes less than a minute.
              </p>
              <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all transform hover:scale-105">
                Start Your Journey
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Ignite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
