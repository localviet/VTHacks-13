import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";

export default function BusinessView() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock business data - replace with actual data from your backend
  const business = {
    name: "Tech Solutions Inc.",
    logo: "https://placeholder.com/150", // Add actual logo URL
    about: "We are a leading technology solutions provider specializing in innovative software development and digital transformation. Our team of experts is dedicated to delivering cutting-edge solutions that help businesses thrive in the digital age.",
    website: "https://techsolutions.example.com",
    location: "San Francisco, CA",
    industry: "Technology",
    founded: "2015",
    employeeCount: "50-100"
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <header className="bg-white shadow-sm border-b p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
            <p className="text-gray-600 mt-1">{business.location}</p>
          </div>
        </header>

        <main className="p-6">
          {/* Top section with Make Offer button */}
          <div className="mb-6 flex justify-end">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              onClick={() => {/* Add your offer logic here */}}
            >
              Make an Offer
            </button>
          </div>

          {/* Logo and Business Details in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center justify-center">
              <img 
                src={business.logo} 
                alt={`${business.name} logo`} 
                className="w-48 h-48 object-contain mb-4"
              />
              <p className="text-gray-600 text-center mt-4">{business.about}</p>
            </div>

            {/* Business Details */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Business Details</h2>
              <div className="grid gap-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Website</span>
                  <a href={business.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {business.website}
                  </a>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Industry</span>
                  <span className="text-gray-900">{business.industry}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Founded</span>
                  <span className="text-gray-900">{business.founded}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Company Size</span>
                  <span className="text-gray-900">{business.employeeCount} employees</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}