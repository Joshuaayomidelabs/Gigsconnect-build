import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { supabase } from '../../src/supabaseClient';

const PostGigTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    pay: '',
    date_time: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to post a gig.');

      const { error } = await supabase
        .from('gigs')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            location: formData.location,
            pay: formData.pay,
            date_time: formData.date_time
          }
        ]);

      if (error) throw error;

      setSuccess(true);
      setFormData({ title: '', description: '', location: '', pay: '', date_time: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to post gig.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 relative z-10 max-w-3xl mx-auto">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Post a Gig</h1>
        <p className="text-gray-500 mt-1 text-lg">Find the perfect talent for your next project</p>
      </section>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-center font-medium">
            Gig posted successfully!
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-center font-medium">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Gig Title *</label>
            <input required name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g. Lead Guitarist for Studio Session" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the gig, requirements, and expectations..." className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Location *</label>
              <input required name="location" value={formData.location} onChange={handleChange} type="text" placeholder="City, Country or Remote" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Pay Amount *</label>
              <input required name="pay" value={formData.pay} onChange={handleChange} type="text" placeholder="e.g. $500 or ₦200k" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Date & Time *</label>
            <input required name="date_time" value={formData.date_time} onChange={handleChange} type="text" placeholder="e.g. Oct 15, 2026 at 6:00 PM" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Reference File (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">MP3, WAV, PDF, or Image (max 10MB)</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100 shadow-sm"
          >
            {isSubmitting ? 'Posting...' : 'Post Gig'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostGigTab;
