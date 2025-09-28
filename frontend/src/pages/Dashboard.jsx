import { useState, useEffect } from "react";
import axios from "axios";
import { Settings, Search, Eye, FileText, DollarSign } from "lucide-react";
import Sidebar from "../components/sidebar.jsx";

export default function IgniteDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [showBrandsModal, setShowBrandsModal] = useState(false);
  const [offerList, setOfferList] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [errorOffers, setErrorOffers] = useState("");
  const user = "Alex";

  useEffect(() => {
    // Fetch offers from the backend API
    const token = localStorage.getItem("accessToken");
    axios
      .request({
        url: `${import.meta.env.VITE_API_URL}/offer/get-received-offers`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOffers(res.data?.offers || []);
      })
      .catch((error) => {
        console.error("Error fetching offers:", error);
      });
  }, []);

  const handleViewAll = async () => {
    try {
      setLoadingOffers(true);
      setErrorOffers("");

      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL
        }/offer/get-received-offers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const statusOrder = { active: 1, pending: 2, review: 3 };

      let list = Array.isArray(res.data) ? res.data : res.data?.offers ?? [];

      list.sort((a, b) => {
        const orderA = statusOrder[(a.status || "").toLowerCase()] || 99;
        const orderB = statusOrder[(b.status || "").toLowerCase()] || 99;
        return orderA - orderB;
      });

      setOfferList(list);
      setShowBrandsModal(true);
    } catch (err) {
      setErrorOffers(err?.response?.data?.message || "Failed to fetch offers");
    } finally {
      setLoadingOffers(false);
    }
  };

  const sidebarItems = [
    { icon: Settings, label: "Settings" },
    { icon: Search, label: "Search" },
  ];

  const stats = [
    {
      label: "Total Views",
      value: "1.2M",
      icon: Eye,
      change: "+12.5%",
      color: "bg-blue-500",
    },
    {
      label: "Posts",
      value: "234",
      icon: FileText,
      change: "+8",
      color: "bg-green-500",
    },
    {
      label: "Money Earned",
      value: "$5,847",
      icon: DollarSign,
      change: "+15.3%",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome {user}</h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your content today
            </p>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Offers Section */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Active Offers
                </h2>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  onClick={handleViewAll}
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mt-4 max-h-96 overflow-y-auto space-y-3 pr-1">
                {offers.map((offer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {console.log("offer:", offer)}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {(offer.fromName || offer.brand || "?")[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {offer.fromName || offer.brand}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Due: {offer.deadline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-900">
                        {offer.salary || offer.amount}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          offer.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : offer.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {offer.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {showBrandsModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <button
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowBrandsModal(false)}
              aria-label="Close modal"
            />

            {/* Panel */}
            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">All Offers</h2>
              </div>

              {/* Loading / error states */}
              {loadingOffers && (
                <p className="mt-4 text-sm text-gray-600">Loading…</p>
              )}
              {errorOffers && (
                <p className="mt-4 text-sm text-red-600">{errorOffers}</p>
              )}

              {/* Scrollable list */}
              <div className="mt-4 max-h-96 overflow-y-auto space-y-3 pr-1">
                {offerList.length === 0 && !loadingOffers && !errorOffers && (
                  <p className="text-sm text-gray-500">No offers yet.</p>
                )}

                {offerList.map((offer, idx) => (
                  <div
                    key={offer.id || offer._id || idx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {
                            (offer.brand ||
                              offer.company ||
                              offer.name ||
                              "?")[0]
                          }
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {offer.brand ||
                            offer.company ||
                            offer.name ||
                            "Unknown Brand"}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Due: {offer.deadline || offer.dueDate || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-900">
                        {offer.amount || offer.price || offer.budget || "$—"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          (offer.status || "").toLowerCase() === "active"
                            ? "bg-green-100 text-green-800"
                            : (offer.status || "").toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {offer.status || "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  onClick={() => setShowBrandsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
