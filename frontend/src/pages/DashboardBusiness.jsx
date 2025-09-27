import { useState } from "react";
import { 
  Settings, 
  Search,
  Eye,
  FileText,
  DollarSign
} from "lucide-react";
import Sidebar from "../components/sidebar.jsx";

export default function IgniteDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = "Alex";

  const sidebarItems = [
    { icon: Settings, label: "Settings" },
    { icon: Search, label: "Search" },
  ];

  const stats = [
    { label: "Total Views", value: "1.2M", icon: Eye, change: "+12.5%", color: "bg-blue-500" },
    { label: "Posts", value: "234", icon: FileText, change: "+8", color: "bg-green-500" },
    { label: "Money Spent", value: "$5,847", icon: DollarSign, change: "+15.3%", color: "bg-purple-500" },
  ];

  const creators = [
    { brand: "Riley", amount: "$200", status: "Active", deadline: "Dec 15" },
    { brand: "Nikhil", amount: "$300", status: "Pending", deadline: "Dec 20" },
    { brand: "Hung", amount: "$199", status: "Active", deadline: "Jan 5" },
    { brand: "Khang", amount: "$100", status: "Review", deadline: "Dec 18" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome {user}</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your content today</p>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-green-600 text-sm mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Creators Section */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Active Creators</h2>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {creators.map((creator, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{creator.brand[0]}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{creator.brand}</h3>
                        <p className="text-gray-600 text-sm">Due: {creator.deadline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-900">{creator.amount}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        creator.status === "Active" ? "bg-green-100 text-green-800" :
                        creator.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {creator.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}