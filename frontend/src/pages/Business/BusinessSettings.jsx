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
import BusinessSidebar from "../../components/BusinessSidebar.jsx";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  // Mock user data based on your schema
  const [userData, setUserData] = useState({
    businessName: "Alex's Creations",
    email: "alex.johnson@example.com",
    phoneNumber: "5551234567",
    description: "Looking for UGC creators to showcase our lifestyle products in short-form videos and photos.",
    tags: ["lifestyle", "short-form", "product-review"]
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
  const [tagInput, setTagInput] = useState("");
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
    
    if (!formData.businessName || !formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
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

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (formData.tags && formData.tags.includes(t)) {
      setTagInput("");
      return;
    }
    setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), t] }));
    setTagInput("");
  };

  const removeTag = (index) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <BusinessSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
                {/* Business Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Business Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.businessName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your business name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                      {userData.businessName}
                    </div>
                  )}
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Video className="w-4 h-4 inline mr-2" />
                    Description (what you're looking for)
                  </label>
                  {editMode ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 border-gray-300`}
                      placeholder="Describe the job/product/place you're seeking UGC creators for"
                      rows={4}
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-wrap">
                      {userData.description || 'No description provided.'}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Tags
                  </label>
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {(formData.tags || userData.tags || []).map((tag, idx) => (
                        <div key={idx} className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          <span className="mr-2">#{tag}</span>
                          {editMode && (
                            <button onClick={() => removeTag(idx)} className="text-red-500 hover:text-red-700">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Add a tag and press Enter"
                        className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
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