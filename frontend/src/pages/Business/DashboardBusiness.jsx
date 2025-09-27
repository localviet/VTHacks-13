import { useState, useEffect } from "react";
import { 
  Settings, 
  Search,
  Eye,
  FileText,
  DollarSign
} from "lucide-react";
import BusinessSidebar from "../../components/BusinessSidebar.jsx";

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

  // initial dummy data (visible immediately) — will be replaced by backend fetch when available
  // initial offers (dummy). Each offer should have an id when returned from backend
  const initialCreators = [
    { id: 1, brand: "Riley", amount: "$200", status: "Active", deadline: "Dec 15" },
    { id: 2, brand: "Nikhil", amount: "$300", status: "Pending", deadline: "Dec 20" },
    { id: 3, brand: "Hung", amount: "$199", status: "Active", deadline: "Jan 5" },
    { id: 4, brand: "Khang", amount: "$100", status: "Review", deadline: "Dec 18" },
  ];

  const initialVideos = [
    { title: 'Winter Promo', user: 'Riley', views: '120k', likes: '8.4k' },
    { title: 'How-to Guide', user: 'Nikhil', views: '98k', likes: '6.1k' },
    { title: 'Unboxing', user: 'Hung', views: '45k', likes: '2.9k' },
  ];

  const [creators, setCreators] = useState(initialCreators);
  const [videos, setVideos] = useState(initialVideos);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [processingOfferId, setProcessingOfferId] = useState(null);

  // Fetch creators and videos from backend when the component mounts.
  // If the backend endpoints are not yet implemented, we keep the dummy data.
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const [cRes, vRes] = await Promise.all([
          fetch('/api/business/creators'),
          fetch('/api/business/videos')
        ]);

        if (!cRes.ok || !vRes.ok) {
          throw new Error('One or more requests failed');
        }

        const [cJson, vJson] = await Promise.all([cRes.json(), vRes.json()]);
        if (!cancelled) {
          // Expecting arrays from backend; fall back if unexpected
          if (Array.isArray(cJson)) setCreators(cJson);
          if (Array.isArray(vJson)) setVideos(vJson);
        }
      } catch (err) {
        // keep dummy data and surface a non-blocking error
        if (!cancelled) setFetchError(err.message || 'Failed to load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
    <BusinessSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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

          {/* Creators + Best Performing Videos Section (two-column on md+) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Active Offers */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Active Offers</h2>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {creators.map((creator) => (
                    <div key={creator.id} className="flex flex-col lg:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{creator.brand[0]}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{creator.brand}</h3>
                          <p className="text-gray-600 text-sm">Deadline: {creator.deadline}</p>
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
                        {/* Show accept/decline for offers under review or pending */}
                        {(creator.status === 'Review') && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={processingOfferId === creator.id}
                              onClick={async () => {
                                setProcessingOfferId(creator.id);
                                setFetchError(null);
                                // optimistic update
                                setCreators((prev) => prev.map(c => c.id === creator.id ? { ...c, status: 'Active' } : c));
                                try {
                                  const res = await fetch(`/api/business/offers/${creator.id}/accept`, { method: 'POST' });
                                  if (!res.ok) throw new Error('Failed to accept offer');
                                } catch (err) {
                                  // revert
                                  setCreators((prev) => prev.map(c => c.id === creator.id ? { ...c, status: creator.status } : c));
                                  setFetchError(err.message || 'Action failed');
                                } finally {
                                  setProcessingOfferId(null);
                                }
                              }}
                              className="rounded-md bg-green-600 text-white px-3 py-1 text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              disabled={processingOfferId === creator.id}
                              onClick={async () => {
                                setProcessingOfferId(creator.id);
                                setFetchError(null);
                                // optimistic update
                                setCreators((prev) => prev.map(c => c.id === creator.id ? { ...c, status: 'Declined' } : c));
                                try {
                                  const res = await fetch(`/api/business/offers/${creator.id}/decline`, { method: 'POST' });
                                  if (!res.ok) throw new Error('Failed to decline offer');
                                } catch (err) {
                                  // revert
                                  setCreators((prev) => prev.map(c => c.id === creator.id ? { ...c, status: creator.status } : c));
                                  setFetchError(err.message || 'Action failed');
                                } finally {
                                  setProcessingOfferId(null);
                                }
                              }}
                              className="rounded-md bg-red-100 text-red-700 px-3 py-1 text-sm hover:bg-red-200 disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Best Performing Videos */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-gray-900">Best Performing Videos</h2>
                </div>
                <p className="text-gray-600 text-sm mt-2">Top videos your business has paid creators for</p>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {videos.map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <h3 className="font-semibold text-gray-900">{v.title}</h3>
                        <p className="text-gray-600 text-sm">By {v.user}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{v.views}</p>
                        <p className="text-sm text-gray-600">{v.likes} likes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}