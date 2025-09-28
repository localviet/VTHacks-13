import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchJobs = async () => {
      setLoadingJobs(true);
      setJobsError(null);
      try {
        const res = await fetch('http://localhost:5001/job-listing/all-job-listings');
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
  const data = await res.json();
  // Expecting an array; backend may return { jobListings: [...] }
  const list = Array.isArray(data) ? data : (data.jobs || data.jobListings || []);
  if (mounted) setJobs(list);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        if (mounted) setJobsError(err.message || 'Failed to fetch');
      } finally {
        if (mounted) setLoadingJobs(false);
      }
    };
    fetchJobs();
    return () => { mounted = false; };
  }, []);

  const filteredJobs = (jobs || []).filter(job => {
    const companyName = (job.company && job.company.name) || job.name || job.title || '';
    const name = String(companyName).toLowerCase();
    const desc = String(job.description || job.desc || job.product || job.title || '').toLowerCase();
    const jobTags = (job.tags || []).map(t => String(t).toLowerCase());

    const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
                         desc.includes(searchTerm.toLowerCase()) ||
                         jobTags.some(tag => tag.includes(searchTerm.toLowerCase()));

    const matchesFilter = selectedFilter === "All" || 
                         jobTags.some(tag => tag.includes(selectedFilter.toLowerCase()));

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingJobs ? (
              <div className="col-span-full text-center py-12">Loading jobs...</div>
            ) : jobsError ? (
              <div className="col-span-full text-center py-12 text-red-600">Failed to load jobs: {jobsError}</div>
            ) : (
              filteredJobs.map((job) => (
                <Link to={`/view/${job.id || job._id}`} key={job.id || job._id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow flex flex-col h-full">
                  <div className="flex items-start gap-4">
                    {/* Logo / color square */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${job.color || 'from-gray-400 to-gray-500'} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-xl">{(job.company && job.company.name && job.company.name.charAt(0)) || job.logo || (job.name || job.title || '').charAt(0)}</span>
                    </div>
                    {/* Job Info */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{(job.company && job.company.name) || job.name || job.title}</h3>
                          <p className="text-gray-600 font-medium">{job.title || job.product || job.subtitle || ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{job.budget || (Array.isArray(job.salaryRange) && job.salaryRange.length ? `$${job.salaryRange[0]} - $${job.salaryRange[1]}` : job.salary || '')}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{job.deadline || ''}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{job.followers || ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">{job.description || job.product || ''}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {(job.tags || []).map((tag, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {filteredJobs.length === 0 && (
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