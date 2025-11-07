'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AINavigationSystem } from '../../components/AINavigationSystem';
import { 
  AICard, 
  AIButton, 
  AIInput, 
  AISelect, 
  AIBadge, 
  AILoading, 
  AIToast 
} from '../../components/UIComponents';

export default function ProfilePage() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    department: '',
    location: '',
    timezone: '',
    notification_preferences: {
      email_notifications: true,
      push_notifications: true,
      weekly_digest: true,
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        department: user.department || '',
        location: user.location || '',
        timezone: user.timezone || 'UTC',
        notification_preferences: user.notification_preferences || {
          email_notifications: true,
          push_notifications: true,
          weekly_digest: true,
        }
      });
    }
  }, [user]);

  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
      
      // In real implementation, call refreshUser() after successful API update
    } catch (error) {
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        department: user.department || '',
        location: user.location || '',
        timezone: user.timezone || 'UTC',
        notification_preferences: user.notification_preferences || {
          email_notifications: true,
          push_notifications: true,
          weekly_digest: true,
        }
      });
    }
    setIsEditing(false);
  };

  const departments = [
    { value: 'engineering', label: '⚙️ Engineering' },
    { value: 'design', label: '🎨 Design' },
    { value: 'product', label: '📋 Product Management' },
    { value: 'qa', label: '🧪 Quality Assurance' },
    { value: 'marketing', label: '📢 Marketing' },
    { value: 'sales', label: '💼 Sales' },
    { value: 'support', label: '🎧 Customer Support' },
    { value: 'hr', label: '👥 Human Resources' },
  ];

  const timezones = [
    { value: 'UTC', label: '🌍 UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: '🏙️ Eastern Time (ET)' },
    { value: 'America/Chicago', label: '🌆 Central Time (CT)' },
    { value: 'America/Denver', label: '🏔️ Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: '🌴 Pacific Time (PT)' },
    { value: 'Europe/London', label: '🇬🇧 British Time (GMT)' },
    { value: 'Europe/Paris', label: '🇫🇷 Central European Time (CET)' },
    { value: 'Europe/Sofia', label: '🇧🇬 Eastern European Time (EET)' },
    { value: 'Asia/Tokyo', label: '🇯🇵 Japan Standard Time (JST)' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AINavigationSystem />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Overview Card */}
            <div className="lg:col-span-1">
              <AICard className="p-6">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {user?.name || 'User Name'}
                  </h2>
                  
                  <AIBadge 
                    variant={user?.role?.name === 'owner' ? 'danger' : 
                             user?.role?.name === 'pm' ? 'primary' : 
                             user?.role?.name === 'backend' ? 'success' : 
                             user?.role?.name === 'frontend' ? 'secondary' : 
                             user?.role?.name === 'qa' ? 'warning' : 'info'}
                    className="mb-4"
                  >
                    {user?.role?.name === 'owner' ? '👑' : 
                     user?.role?.name === 'pm' ? '📋' :
                     user?.role?.name === 'backend' ? '⚙️' :
                     user?.role?.name === 'frontend' ? '🎨' :
                     user?.role?.name === 'qa' ? '🧪' : '🎨'} {user?.role?.display_name}
                  </AIBadge>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">12</p>
                        <p className="text-xs text-gray-500">Tools Used</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">5</p>
                        <p className="text-xs text-gray-500">Projects</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AICard>

              {/* Security Card */}
              <AICard className="p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔐 Security</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Two-Factor Auth</span>
                    <AIBadge variant="warning">Disabled</AIBadge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Login</span>
                    <span className="text-sm text-gray-900">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Password</span>
                    <AIButton variant="ghost" size="sm">
                      Change
                    </AIButton>
                  </div>
                </div>
              </AICard>
            </div>

            {/* Profile Details Form */}
            <div className="lg:col-span-2">
              <AICard className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  
                  {!isEditing ? (
                    <AIButton onClick={() => setIsEditing(true)}>
                      ✏️ Edit Profile
                    </AIButton>
                  ) : (
                    <div className="flex space-x-3">
                      <AIButton variant="secondary" onClick={handleCancel}>
                        Cancel
                      </AIButton>
                      <AIButton onClick={handleSave} loading={loading}>
                        💾 Save Changes
                      </AIButton>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AIInput
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                    required
                  />
                  
                  <AIInput
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                    required
                  />
                  
                  <AIInput
                    label="Phone Number"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                    placeholder="+1 (555) 123-4567"
                  />
                  
                  <AISelect
                    label="Department"
                    options={departments}
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                    disabled={!isEditing}
                  />
                  
                  <AIInput
                    label="Location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    disabled={!isEditing}
                    placeholder="New York, NY"
                  />
                  
                  <AISelect
                    label="Timezone"
                    options={timezones}
                    value={profileData.timezone}
                    onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    className={`
                      w-full px-4 py-3 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      transition-colors duration-200 resize-none
                      ${!isEditing ? 'bg-gray-50' : ''}
                    `}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </AICard>

              {/* Notification Preferences */}
              <AICard className="p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">🔔 Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={profileData.notification_preferences.email_notifications}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          notification_preferences: {
                            ...profileData.notification_preferences,
                            email_notifications: e.target.checked
                          }
                        })}
                        disabled={!isEditing}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-500">Receive browser notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={profileData.notification_preferences.push_notifications}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          notification_preferences: {
                            ...profileData.notification_preferences,
                            push_notifications: e.target.checked
                          }
                        })}
                        disabled={!isEditing}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Weekly Digest</h4>
                      <p className="text-sm text-gray-500">Summary of your activity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={profileData.notification_preferences.weekly_digest}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          notification_preferences: {
                            ...profileData.notification_preferences,
                            weekly_digest: e.target.checked
                          }
                        })}
                        disabled={!isEditing}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </AICard>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <AIToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </>
  );
}