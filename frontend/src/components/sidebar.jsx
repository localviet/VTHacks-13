import { 
  Settings, 
  Search,
  TrendingUp,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";

const sidebar = ({sidebarOpen, setSidebarOpen}) => {
  return (
    <div>
        <div 
        className={`fixed left-0 top-0 h-full bg-white shadow-xl transition-all duration-300 ease-in-out z-50 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        >
            <div className="p-4">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
                </div>
                 {sidebarOpen && <h1 className="text-xl font-bold text-gray-800">Ignite | <span className="text-blue-600">Business</span></h1>}
            </div>

            <nav className="space-y-2">
                <Link
                    to="/dashboard"
                    className={`flex items-center gap-3 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-50 mb-5`}
                >
                    <Home className={`${sidebarOpen ? "w-5 h-5" : "w-7 h-7"}`} />
                    {sidebarOpen && <span className="font-medium">Dashboard </span>}

                </Link>
                <Link
                    to="/search"
                    className={`flex items-center gap-3 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-50 mb-5`}
                >
                    <Search className={`${sidebarOpen ? "w-5 h-5" : "w-7 h-7"}`} />
                    {sidebarOpen && <span className="font-medium">Search</span>}
                </Link>
                <Link
                    to="/settings"
                    className={`flex items-center gap-3 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-50`}
                >
                    <Settings className={`${sidebarOpen ? "w-5 h-5" : "w-7 h-7"}`} />
                    {sidebarOpen && <span className="font-medium">Settings</span>}
                </Link>
            </nav>
            </div>
        </div>
    </div>
  )
}

export default sidebar