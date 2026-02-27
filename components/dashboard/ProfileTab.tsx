import React, { useState } from 'react';
import { Camera, Edit2, Save } from 'lucide-react';

const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Alex Johnson',
    stageName: 'AJ Beats',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    genres: 'Afrobeats, R&B, Pop',
    bio: 'Experienced producer and multi-instrumentalist based in Lagos. Always looking for the next big sound.'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
      <section className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1 text-lg">Manage your personal information</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </section>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Photo Area */}
        <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
          <div className="absolute -bottom-12 sm:-bottom-16 left-6 sm:left-10 flex items-end gap-6">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 sm:pt-20 px-6 sm:px-10 pb-10">
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stage Name</label>
                  <input name="stageName" value={formData.stageName} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Genre(s)</label>
                  <input name="genres" value={formData.genres} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{formData.fullName} <span className="text-gray-400 font-normal text-lg">({formData.stageName})</span></h2>
                <p className="text-blue-600 font-medium mt-1">{formData.genres}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</h3>
                  <p className="text-gray-900 font-medium">{formData.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</h3>
                  <p className="text-gray-900 font-medium">{formData.phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Bio</h3>
                  <p className="text-gray-700 leading-relaxed">{formData.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
