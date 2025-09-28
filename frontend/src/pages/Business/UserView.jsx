import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../../components/BusinessSidebar.jsx";
import { MessageCircle } from "lucide-react";
import axios from 'axios';
export default function UserView() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followed, setFollowed] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerStatus, setOfferStatus] = useState('idle'); // idle | sending | success | error
  const [offerError, setOfferError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // we have /api/users which returns creators and corps; find the user by id
        const res = await fetch("http://localhost:5001/api/users");
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        const all = [...(data.creators || []), ...(data.corps || [])];
        const found = all.find((u) => String(u._id) === String(id));
        if (mounted) {
          setUser(found || null);
        }
      } catch (e) {
        console.error("Failed to fetch user:", e);
        if (mounted) setError(e.message || "Failed to fetch");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUser();
    return () => (mounted = false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">Loading user...</div>
    );
  }
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">User not found</h2>
          <p className="text-gray-500 mt-2">We couldn't find that user.</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">Go back</Link>
        </div>
      </div>
    );
  }

  // derive profile fields
  const fullName = user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.name || user.businessName || user.email || 'Unknown';
  const avatar = user.pfpUrl || user.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D9488&color=fff&size=256`;
  const bio = user.bio || user.description || user.about || "This user hasn't added a bio yet.";
  const socials = {
    instagram: user.instagram,
    youtube: user.youtube,
    tiktok: user.tiktok,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <header className="bg-white shadow-sm border-b p-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
              <p className="text-sm text-gray-600 mt-1">{user.email || user.website || ''}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setOfferOpen(true); setOfferStatus('idle'); setOfferError(null); }} className={`inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700`}>
                <MessageCircle className="w-4 h-4" /> Offer
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <aside className="col-span-1 bg-white rounded-xl shadow-sm border p-6">
              <div className="flex flex-col items-center text-center">
                <img src={avatar} alt={fullName} className="w-32 h-32 rounded-full object-cover mb-4" />
                <h2 className="text-xl font-bold">{fullName}</h2>
                <p className="text-sm text-gray-500 mt-2">{bio}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-600">Socials</h3>
                <div className="flex gap-3 mt-3">
                  {socials.instagram && <a href={`https://instagram.com/${socials.instagram}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-pink-50 rounded-md text-pink-600">Instagram</a>}
                  {socials.youtube && <a href={`https://youtube.com/${socials.youtube}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-red-50 rounded-md text-red-600">YouTube</a>}
                  {socials.tiktok && <a href={`https://tiktok.com/@${socials.tiktok}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-black text-white rounded-md">TikTok</a>}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-600">Tags</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(user.tags || []).map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">#{t}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold">{(user.offers || []).length}</div>
                  <div className="text-sm text-gray-500">Offers</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{user.followers || 0}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{user.tags ? user.tags.length : 0}</div>
                  <div className="text-sm text-gray-500">Interests</div>
                </div>
              </div>
            </aside>

            <section className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h3 className="text-lg font-bold mb-3">Portfolio</h3>
                <p className="text-sm text-gray-500 mb-4">Recent work and offers posted by this user.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(user.offers || []).length === 0 ? (
                    <div className="col-span-full text-gray-500">No portfolio items yet.</div>
                  ) : (
                    (user.offers || []).map((offer, idx) => (
                      <div key={offer._id || idx} className="border rounded-lg p-4 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold">{offer.title || offer.name || 'Untitled'}</h4>
                          <p className="text-sm text-gray-600 mt-2">{offer.description ? (offer.description.length > 120 ? offer.description.slice(0, 120) + '...' : offer.description) : 'No description'}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-gray-500">${offer.price || offer.budget || '—'}</div>
                          <Link to={`/view/${offer._id || ''}`} className="text-indigo-600 hover:underline text-sm">View</Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold mb-3">About</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{bio}</p>
              </div>
            </section>
          </div>
        </main>

        {/* Offer Modal */}
        {offerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => { if(offerStatus !== 'sending') setOfferOpen(false); }} />
            <div className="relative bg-white rounded-xl shadow-lg w-11/12 max-w-xl p-6">
              <h3 className="text-xl font-bold mb-2">Send Offer</h3>
              <p className="text-gray-700 mb-4">You're about to send an offer to: <strong>{fullName}</strong></p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                <input type="number" min="0" defaultValue={100} id="offer-amount" className="w-full border rounded px-3 py-2" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
                <textarea id="offer-message" rows={4} className="w-full border rounded px-3 py-2" placeholder={`Hi ${user.firstName || fullName}, make a short form video...`} />
              </div>

              <div className="mb-4">
                {offerStatus === 'idle' && <div className="text-sm text-gray-500">Click Send to dispatch the offer.</div>}
                {offerStatus === 'sending' && <div className="text-sm text-gray-600">Sending offer... <span className="animate-pulse">●</span></div>}
                {offerStatus === 'success' && <div className="text-sm text-green-600">Offer sent successfully.</div>}
                {offerStatus === 'error' && <div className="text-sm text-red-600">Failed to send offer: {offerError || 'Unknown error'}</div>}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
                  onClick={() => { if(offerStatus !== 'sending') setOfferOpen(false); }}
                  disabled={offerStatus === 'sending'}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                  onClick={async () => {
                    console.log("IN HERE");
                    if (offerStatus === 'sending') return;
                    try {
                        console.log("IN HERE 2");
                      setOfferStatus('sending');
                      setOfferError(null);
                      console.log("IN HERE 3");
                      const accessToken = localStorage.getItem('accessToken');
                      const amountEl = document.getElementById('offer-amount');
                      const msgEl = document.getElementById('offer-message');
                      const decoded = await axios.request({
                        method:'GET',url:'http://localhost:5001/api/solveJWT',
                        headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }});
                      console.log(decoded);
                      const payload = {
                        to: user._id || user.id,
                        salary: Number(amountEl?.value || 0),
                        desc: msgEl?.value || '',
                        deadline: new Date(Date.now() + 7*24*60*60*1000).toISOString() // default 7 days from now
                      };

                      const resp = await fetch('http://localhost:5001/offer/create-offer', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                         },
                        body: JSON.stringify(payload)
                      });
                      if (!resp.ok) {
                        const err = await resp.json().catch(() => ({}));
                        setOfferStatus('error');
                        setOfferError(err.message || resp.statusText || 'Server error');
                      } else {
                        setOfferStatus('success');
                        setTimeout(() => setOfferOpen(false), 1200);
                      }
                    } catch (e) {
                      setOfferStatus('error');
                      setOfferError(e.message || 'Network error');
                    }
                  }}
                  disabled={offerStatus === 'sending'}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}