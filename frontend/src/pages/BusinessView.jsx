import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";

export default function BusinessView() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id: jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job listing by id
  useEffect(() => {
    if (!jobId) return;
    let mounted = true;
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5001/job-listing/job-listing/${jobId}`);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        // Expect { jobListing: ... }
        const j = data.jobListing || data.job || null;
        if (mounted) setJob(j);
      } catch (e) {
        console.error('Failed to fetch job by id:', e);
        if (mounted) setError(e.message || 'Failed to fetch');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchJob();
    return () => { mounted = false; };
  }, [jobId]);

  // Build business object from fetched job with sensible fallbacks to mock data
  const business = {
    name: (job && ((job.company && job.company.name) || job.name || job.title)) || "Tech Solutions Inc.",
    logo: (job && ((job.company && job.company.logo) || job.logo || 'https://placeholder.com/150')) || "https://placeholder.com/150",
    about: (job && (job.description || job.desc)) || "We are a leading technology solutions provider specializing in innovative software development and digital transformation. Our team of experts is dedicated to delivering cutting-edge solutions that help businesses thrive in the digital age.",
    website: (job && ((job.company && job.company.website) || job.website)) || "https://techsolutions.example.com",
    tags: (job && (job.tags || [])) || ["Technology", "Software", "Innovation"],
    price: (job && (Array.isArray(job.salaryRange) && job.salaryRange.length ? job.salaryRange[0] : job.price)) ?? 294
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [offerStatus, setOfferStatus] = useState('idle'); // idle | sending | success | error
  const [offerError, setOfferError] = useState(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <header className="bg-white shadow-sm border-b p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
          </div>
        </header>

        <main className="p-6">
          {loading && <div className="text-center py-12">Loading...</div>}
          {error && <div className="text-center py-12 text-red-600">Failed to load job: {error}</div>}
          {/* Logo and Business Details in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

                {/* Tags - modern chips displayed under Website */}
                <div className="py-3">
                  <span className="text-gray-600 block mb-2">Tags</span>
                  <div className="flex flex-wrap gap-3">
                    {(business.tags || []).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Simple Price Display */}
                <div className="py-3">
                  <span className="text-gray-600 block mb-2">Price</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-gray-900">${business.price}</span>
                    <span className="text-sm text-gray-500">avg. project cost</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Make Offer button at the bottom */}
          <div className="flex justify-center mt-8">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-lg text-lg font-medium transition-colors w-full md:w-1/2 text-center"
              onClick={() => { setModalOpen(true); setOfferStatus('idle'); setOfferError(null); }}
            >
              Make an Offer
            </button>
          </div>

          {/* Offer Modal */}
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => { if(offerStatus !== 'sending') setModalOpen(false); }} />
              <div className="relative bg-white rounded-xl shadow-lg w-11/12 max-w-xl p-6">
                <h3 className="text-xl font-bold mb-2">Confirm Offer</h3>
                <p className="text-gray-700 mb-4">You're about to send an offer to:</p>
                <div className="mb-4">
                  <div className="text-lg font-semibold">{business.name}</div>
                  <div className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{business.about}</div>
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-2xl font-extrabold text-gray-900">${business.price}</span>
                    <span className="text-sm text-gray-500">avg. project cost</span>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="mb-4">
                  {offerStatus === 'idle' && <div className="text-sm text-gray-500">Click Confirm to send the offer.</div>}
                  {offerStatus === 'sending' && <div className="text-sm text-gray-600">Sending offer... <span className="animate-pulse">●</span></div>}
                  {offerStatus === 'success' && <div className="text-sm text-green-600">Offer sent successfully.</div>}
                  {offerStatus === 'error' && <div className="text-sm text-red-600">Failed to send offer: {offerError || 'Unknown error'}</div>}
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
                    onClick={() => { if(offerStatus !== 'sending') setModalOpen(false); }}
                    disabled={offerStatus === 'sending'}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                    onClick={async () => {
                      if (offerStatus === 'sending') return;
                      try {
                        setOfferStatus('sending');
                        setOfferError(null);
                        const resp = await fetch('http://localhost:5001/offer/create-offer', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            businessName: business.name,
                            description: business.about,
                            price: business.price,
                            website: business.website
                          })
                        });
                        if (!resp.ok) {
                          const err = await resp.json().catch(() => ({}));
                          setOfferStatus('error');
                          setOfferError(err.message || resp.statusText || 'Server error');
                        } else {
                          setOfferStatus('success');
                          // optionally close modal after short delay
                          setTimeout(() => setModalOpen(false), 1400);
                        }
                      } catch (e) {
                        setOfferStatus('error');
                        setOfferError(e.message || 'Network error');
                      }
                    }}
                    disabled={offerStatus === 'sending'}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}