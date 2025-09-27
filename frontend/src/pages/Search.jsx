import { useState } from "react";
import { 
  Settings, 
  Search,
  Filter,
  Clock,
  Users
} from "lucide-react";
import Sidebar from "../components/sidebar.jsx";

export default function IgniteForYouPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const sidebarItems = [
    { icon: Settings, label: "Settings" },
    { icon: Search, label: "Search" },
  ];

  const filters = ["All", "Tech", "Fashion", "Beauty", "Food", "Travel", "Fitness"];

  const companies = [
    {
      id: 1,
      name: "TechFlow",
      logo: "T",
      product: "AI-powered productivity app",
      description: "Looking for tech reviewers to showcase our new AI assistant. Perfect for creators who focus on productivity and tech innovations.",
      budget: "$2,500 - $5,000",
      deadline: "Dec 20",
      followers: "10K+",
      tags: ["tech", "ai", "productivity"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      name: "StyleVibe",
      logo: "S",
      product: "Sustainable fashion line",
      description: "Seeking fashion influencers to create styling videos with our eco-friendly clothing collection. Focus on sustainable fashion trends.",
      budget: "$1,800 - $3,200",
      deadline: "Jan 5",
      followers: "50K+",
      tags: ["fashion", "sustainable", "lifestyle"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 3,
      name: "GlowUp",
      logo: "G",
      product: "Premium skincare products",
      description: "Looking for beauty creators to demonstrate our new anti-aging serum. Perfect for morning/evening routine content.",
      budget: "$3,000 - $6,000",
      deadline: "Dec 15",
      followers: "25K+",
      tags: ["beauty", "skincare", "wellness"],
      color: "from-purple-500 to-indigo-500"
    },
    {
      id: 4,
      name: "FitCore",
      logo: "F",
      product: "Smart fitness equipment",
      description: "Seeking fitness influencers to create workout videos using our smart home gym equipment. Focus on home workouts and health.",
      budget: "$4,000 - $8,000",
      deadline: "Jan 10",
      followers: "100K+",
      tags: ["fitness", "health", "tech"],
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 5,
      name: "TasteLocal",
      logo: "T",
      product: "Artisanal food products",
      description: "Looking for food content creators to feature our local artisanal products in cooking videos and taste tests.",
      budget: "$1,500 - $2,800",
      deadline: "Dec 25",
      followers: "20K+",
      tags: ["food", "cooking", "local"],
      color: "from-orange-500 to-red-500"
    },
    {
      id: 6,
      name: "WanderLux",
      logo: "W",
      product: "Luxury travel experiences",
      description: "Seeking travel influencers to showcase our premium travel packages. Create engaging destination content and travel vlogs.",
      budget: "$5,000 - $10,000",
      deadline: "Feb 1",
      followers: "75K+",
      tags: ["travel", "luxury", "lifestyle"],
      color: "from-teal-500 to-blue-500"
    }
  ];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === "All" || 
                         company.tags.some(tag => tag.toLowerCase().includes(selectedFilter.toLowerCase()));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">For You</h1>
            <p className="text-gray-600 mt-1">Discover brand partnerships perfect for your content</p>
          </div>
        </header>

        {/* Search and Filter Section */}
        <div className="bg-white border-b p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Search companies, products, or tags..."
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="appearance-none rounded-lg border border-gray-300 py-2.5 pl-10 pr-8 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white min-w-32"
              >
                {filters.map(filter => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Companies List */}
        <main className="p-6">
          <div className="space-y-6">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${company.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-xl">{company.logo}</span>
                  </div>

                  {/* Company Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                        <p className="text-gray-600 font-medium">{company.product}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{company.budget}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{company.deadline}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{company.followers}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">{company.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {company.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 flex justify-end">
                      <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No companies found matching your criteria.</p>
              <p className="text-gray-400">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}