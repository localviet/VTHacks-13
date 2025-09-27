import { useState } from "react";
import { 
  Settings, 
  Search,
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Edit,
  Check,
  X,
  Instagram,
  Youtube,
  Twitter,
  Plus,
  Trash2,
  Link,
  Video
} from "lucide-react";
import Sidebar from "../components/sidebar.jsx";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  // Mock user data based on your schema
  const [userData, setUserData] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phoneNumber: "5551234567",
  });

  const [socialMedia, setSocialMedia] = useState([
    { id: 1, platform: "Instagram", username: "@alex_creates", url: "https://instagram.com/alex_creates", type: "profile" },
    { id: 2, platform: "YouTube", username: "Alex Creates", url: "https://youtube.com/c/alexcreates", type: "profile" },
    { id: 3, platform: "TikTok", username: "@alexcreates", url: "https://tiktok.com/@alexcreates", type: "profile" },
  ]);

  const [videos, setVideos] = useState([
    { id: 1, title: "Nike Campaign Video", url: "https://youtube.com/watch?v=example1", platform: "YouTube", views: "125K" },
    { id: 2, title: "Apple Product Review", url: "https://instagram.com/reel/example2", platform: "Instagram", views: "89K" },
    { id: 3, title: "Tesla Test Drive", url: "https://tiktok.com/@alexcreates/video/example3", platform: "TikTok", views: "234K" },
  ]);

  const [newSocialMedia, setNewSocialMedia] = useState({ platform: "", username: "", url: "" });
  const [newVideo, setNewVideo] = useState({ title: "", url: "", platform: "" });
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);

  const [formData, setFormData] = useState({ ...userData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const sidebarItems = [
    { icon: Settings, label: "Settings" },
    { icon: Search, label: "Search" },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email && !formData.phoneNumber) {
      newErrors.email = "Either email or phone number is required";
      newErrors.phoneNumber = "Either email or phone number is required";
    }
    
    if (formData.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = "Please add a valid email address";
    }
    
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please add a valid 10-digit phone number";
    }
    
    if (showPasswordChange) {
      if (!passwordData.currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }
      
      if (!passwordData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (passwordData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters long";
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      setUserData({ ...formData });
      setEditMode(false);
      setShowPasswordChange(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({ ...userData });
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setEditMode(false);
    setShowPasswordChange(false);
    setShowAddSocial(false);
    setShowAddVideo(false);
    setNewSocialMedia({ platform: "", username: "", url: "" });
    setNewVideo({ title: "", url: "", platform: "" });
    setErrors({});
  };

  const handleAddSocialMedia = () => {
    if (newSocialMedia.platform && newSocialMedia.username && newSocialMedia.url) {
      setSocialMedia(prev => [...prev, { 
        id: Date.now(), 
        ...newSocialMedia,
        type: "profile"
      }]);
      setNewSocialMedia({ platform: "", username: "", url: "" });
      setShowAddSocial(false);
    }
  };

  const handleRemoveSocialMedia = (id) => {
    setSocialMedia(prev => prev.filter(item => item.id !== id));
  };

  const handleAddVideo = () => {
    if (newVideo.title && newVideo.url && newVideo.platform) {
      setVideos(prev => [...prev, { 
        id: Date.now(), 
        ...newVideo,
        views: "0"
      }]);
      setNewVideo({ title: "", url: "", platform: "" });
      setShowAddVideo(false);
    }
  };

  const handleRemoveVideo = (id) => {
    setVideos(prev => prev.filter(item => item.id !== id));
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return Instagram;
      case 'youtube': return Youtube;
      case 'twitter': return Twitter;
      default: return Link;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return 'from-pink-500 to-purple-500';
      case 'youtube': return 'from-red-500 to-red-600';
      case 'twitter': return 'from-blue-400 to-blue-500';
      case 'tiktok': return 'from-black to-gray-800';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>
            {saved && (
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Settings saved successfully!</span>
              </div>
            )}
          </div>
        </header>

        {/* Settings Content */}
        <main className="p-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-sm border mb-6">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    First Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your first name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                      {userData.firstName}
                    </div>
                  )}
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Last Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your last name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                      {userData.lastName}
                    </div>
                  )}
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                      {userData.email || "Not provided"}
                    </div>
                  )}
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your 10-digit phone number"
                      maxLength="10"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                      {userData.phoneNumber ? 
                        `(${userData.phoneNumber.slice(0,3)}) ${userData.phoneNumber.slice(3,6)}-${userData.phoneNumber.slice(6)}` 
                        : "Not provided"
                      }
                    </div>
                  )}
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Settings */}
          <div className="bg-white rounded-xl shadow-sm border mb-6">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Social Media Accounts</h2>
                <button
                  onClick={() => setShowAddSocial(!showAddSocial)}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Account
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Add New Social Media Form */}
              {showAddSocial && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Add New Social Media Account</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                      <select
                        value={newSocialMedia.platform}
                        onChange={(e) => setNewSocialMedia(prev => ({ ...prev, platform: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Select Platform</option>
                        <option value="Instagram">Instagram</option>
                        <option value="YouTube">YouTube</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Twitter">Twitter</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username/Channel</label>
                      <input
                        type="text"
                        value={newSocialMedia.username}
                        onChange={(e) => setNewSocialMedia(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="@username or channel name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile URL</label>
                      <input
                        type="url"
                        value={newSocialMedia.url}
                        onChange={(e) => setNewSocialMedia(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="https://platform.com/username"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={handleAddSocialMedia}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      Add Account
                    </button>
                    <button
                      onClick={() => setShowAddSocial(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Social Media List */}
              <div className="grid gap-4">
                {socialMedia.map((account) => {
                  const PlatformIcon = getPlatformIcon(account.platform);
                  return (
                    <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getPlatformColor(account.platform)} rounded-lg flex items-center justify-center`}>
                          <PlatformIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{account.platform}</h3>
                          <p className="text-gray-600 text-sm">{account.username}</p>
                          <a 
                            href={account.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-red-500 text-sm hover:underline"
                          >
                            {account.url}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSocialMedia(account.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                {socialMedia.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Link className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No social media accounts added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Video Portfolio */}
          <div className="bg-white rounded-xl shadow-sm border mb-6">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Video Portfolio</h2>
                <button
                  onClick={() => setShowAddVideo(!showAddVideo)}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Video
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Add New Video Form */}
              {showAddVideo && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Add New Video</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
                      <input
                        type="text"
                        value={newVideo.title}
                        onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter video title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                      <select
                        value={newVideo.platform}
                        onChange={(e) => setNewVideo(prev => ({ ...prev, platform: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Select Platform</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Instagram">Instagram</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Twitter">Twitter</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                      <input
                        type="url"
                        value={newVideo.url}
                        onChange={(e) => setNewVideo(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="https://platform.com/video-link"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={handleAddVideo}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      Add Video
                    </button>
                    <button
                      onClick={() => setShowAddVideo(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Video List */}
              <div className="grid gap-4">
                {videos.map((video) => {
                  const PlatformIcon = getPlatformIcon(video.platform);
                  return (
                    <div key={video.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getPlatformColor(video.platform)} rounded-lg flex items-center justify-center`}>
                          <Video className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{video.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <PlatformIcon className="w-4 h-4" />
                              {video.platform}
                            </span>
                            <span>{video.views} views</span>
                          </div>
                          <a 
                            href={video.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-red-500 text-sm hover:underline"
                          >
                            {video.url}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveVideo(video.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                {videos.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No videos added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Security</h2>
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                >
                  <Lock className="w-4 h-4 inline mr-2" />
                  {showPasswordChange ? "Cancel Password Change" : "Change Password"}
                </button>
              </div>
            </div>
            
            {showPasswordChange && (
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 max-w-md">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your current password"
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your new password (min 6 characters)"
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your new password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    onClick={handleSave}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors w-full"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {!showPasswordChange && (
              <div className="p-6">
                <p className="text-gray-600">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password was last updated 30 days ago
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}