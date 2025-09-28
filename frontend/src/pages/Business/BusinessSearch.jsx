import { useState } from "react";
import { Settings, Search, Filter, Users } from "lucide-react";
import BusinessSidebar from "../../components/BusinessSidebar.jsx";

export default function BusinessesView() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Tech", "Fashion", "Beauty", "Food", "Travel", "Fitness"];

  // Sample UGC creators data
  const creators = [
    {
      id: 1,
      name: "Ava Reynolds",
      socials: [
        { platform: "Instagram", handle: "@avareynolds", followers: 125000 },
        { platform: "TikTok", handle: "@ava.tok", followers: 98000 },
        { platform: "YouTube", handle: "AvaReynolds", followers: 22000 }
      ],
      imageUrl: "https://picsum.photos/id/1/200/300",
      bio: "Lifestyle creator focusing on eco-friendly living, affordable style, and short-form storytelling.",
      tags: ["lifestyle", "sustainable", "fashion"],
    },
    {
      id: 2,
      name: "Marco Diaz",
      socials: [
        { platform: "TikTok", handle: "@marcodoesfitness", followers: 340000 },
        { platform: "Instagram", handle: "@marco.fit", followers: 120000 }
      ],
      imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&q=80&auto=format&fit=crop",
      bio: "Fitness coach sharing at-home routines, nutrition tips, and transformation stories.",
      tags: ["fitness", "wellness", "home-workout"],
    },
    {
      id: 3,
      name: "Sofia Chen",
      socials: [
        { platform: "Instagram", handle: "@sofia.chen", followers: 89000 },
        { platform: "YouTube", handle: "Sofia C", followers: 42000 }
      ],
      imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80&auto=format&fit=crop",
      bio: "Beauty and skincare creator sharing routine breakdowns and product reviews.",
      tags: ["beauty", "skincare", "reviews"],
    }
  ];

  const filteredCreators = creators.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesName = c.name.toLowerCase().includes(term);
    const matchesTag = c.tags.some((t) => t.toLowerCase().includes(term));
    return matchesName || matchesTag || term === "";
  }).filter((c) => selectedFilter === "All" || c.tags.includes(selectedFilter.toLowerCase()));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <BusinessSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <header className="bg-white shadow-sm border-b p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Businesses</h1>
            <p className="text-gray-600 mt-1">Discover UGC creators to partner with</p>
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
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <main className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {filteredCreators.map((creator) => {
              // pick top 2 socials by followers
              const topSocials = (creator.socials || []).slice().sort((a, b) => (b.followers || 0) - (a.followers || 0)).slice(0, 2);
              const totalFollowers = (creator.socials || []).reduce((s, so) => s + (so.followers || 0), 0);

              return (
                <div key={creator.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  {/* Top bar with name and socials */}
                  <div className="p-4 flex items-center justify-between border-b">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{creator.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        {topSocials.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">{s.handle}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">{Math.round(s.followers / 1000)}k</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-1 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span className="text-sm text-gray-500">{Math.round(totalFollowers / 1000)}k followers</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">{/* placeholder for rate or category */}</div>
                  </div>

                  {/* Main image with hover overlay showing bio */}
                  <div className="relative h-64 md:h-72 bg-gray-100">
                    <img
                      src={creator.imageUrl}
                      alt={`${creator.name} profile`}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
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
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">#{tag}</span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full md:w-auto">Invite</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCreators.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No creators found matching your criteria.</p>
              <p className="text-gray-400">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}