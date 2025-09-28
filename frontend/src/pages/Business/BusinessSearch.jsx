import { useState, useEffect } from "react";
import { Settings, Search, Filter, Users } from "lucide-react";
import BusinessSidebar from "../../components/BusinessSidebar.jsx";
import { Link } from "react-router-dom";

export default function BusinessesView() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = [
    "All",
    "Tech",
    "Fashion",
    "Beauty",
    "Food",
    "Travel",
    "Fitness",
  ];

  // creators will be loaded from backend
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // backend mounts account routes at /api/ (see backend/server.js)
        // default to localhost backend port used in backend/server.js if VITE_API_BASE is not set
        const apiBase =
          import.meta.env.VITE_API_BASE || "http://localhost:5001";
        const res = await fetch(`${apiBase}/api/users`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(
            `Expected JSON response but received: ${text.slice(0, 300)}`
          );
        }
        const data = await res.json();

        // data expected shape: { creators: [...], corps: [...] }
        const creatorsFromApi = (data.creators || []).map((c) => ({
          id: c._id,
          name:
            `${c.firstName || c.name || ""} ${c.lastName || ""}`.trim() ||
            c.name ||
            c.email,
          socials: c.socials || [],
          imageUrl:
            c.imageUrl ||
            c.avatar ||
            `https://picsum.photos/seed/${c._id}/600/400`,
          bio: c.bio || c.description || "",
          tags: (c.tags || []).map((t) => t.toLowerCase()),
          followers: c.followers || 0,
        }));

        const corpsFromApi = (data.corps || []).map((c) => ({
          id: c._id,
          name: c.name || c.businessName || c.email,
          socials: c.socials || [],
          imageUrl:
            c.imageUrl ||
            c.logoUrl ||
            `https://picsum.photos/seed/corp-${c._id}/600/400`,
          bio: c.about || c.description || "",
          tags: (c.tags || []).map((t) => t.toLowerCase()),
        }));

        // combine both lists into creators array
        setCreators([...creatorsFromApi, ...corpsFromApi]);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredCreators = creators
    .filter((c) => {
      const term = searchTerm.toLowerCase();
      const matchesName = c.name.toLowerCase().includes(term);
      const matchesTag = (c.tags || []).some((t) =>
        t.toLowerCase().includes(term)
      );
      return matchesName || matchesTag || term === "";
    })
    .filter(
      (c) =>
        selectedFilter === "All" ||
        (c.tags || []).includes(selectedFilter.toLowerCase())
    );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <BusinessSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <header className="bg-white shadow-sm border-b p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Businesses</h1>
            <p className="text-gray-600 mt-1">
              Discover UGC creators to partner with
            </p>
          </div>
        </header>

        <div className="bg-white border-b p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Search creators, tags, or handles..."
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="appearance-none rounded-lg border border-gray-300 py-2.5 pl-10 pr-8 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white min-w-32"
              >
                {filters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              <div className="col-span-full text-center py-12">
                Loading creators...
              </div>
            )}
            {error && (
              <div className="col-span-full text-center py-12 text-red-500">
                Error: {error}
              </div>
            )}

            {filteredCreators.map((creator) => {
              // pick top 2 socials by followers
              const topSocials = (creator.socials || [])
                .slice()
                .sort((a, b) => (b.followers || 0) - (a.followers || 0))
                .slice(0, 2);
              // Prefer backend-provided follower count when available; otherwise sum socials
              const totalFollowers =
                typeof creator.followers === "number" && creator.followers > 0
                  ? creator.followers
                  : (creator.socials || []).reduce(
                      (s, so) => s + (so.followers || 0),
                      0
                    );

              return (
                <Link
                  to={`/user/${creator.id}`}
                  key={creator.id}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden"
                >
                  {/* Top bar with name and socials */}
                  <div className="p-4 flex items-center justify-between border-b">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {creator.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        {topSocials.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">
                              {s.handle}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">
                              {Math.round(s.followers / 1000)}k
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center gap-1 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span className="text-sm text-gray-500">
                            {Math.round(totalFollowers / 1000)}k followers
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {/* placeholder for rate or category */}
                    </div>
                  </div>

                  {/* Main image with hover overlay showing bio */}
                  <div className="relative h-64 md:h-72 bg-gray-100">
                    <img
                      src={creator.imageUrl}
                      alt={`${creator.name} profile`}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://picsum.photos/seed/${creator.id}/600/400`;
                      }}
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-colors duration-300 flex items-end">
                      <div className="p-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm leading-relaxed">{creator.bio}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tags + actions */}
                  <div className="p-4 border-t flex flex-col items-start gap-4">
                    <div className="flex flex-wrap gap-2">
                      {creator.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredCreators.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No creators found matching your criteria.
              </p>
              <p className="text-gray-400">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
