import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Gig } from '../../pages/Dashboard';

const PostGigTab = ({ onAddGig, onGigPosted }: { onAddGig: (gig: any) => void, onGigPosted: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    currency: 'USD',
    category: 'Music',
    event_type: 'Live Performance',
    event_date: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onAddGig(formData);
      setSuccess(true);
      setFormData({ title: '', description: '', location: '', price: '', currency: 'USD', category: 'Music', event_type: 'Live Performance', event_date: '' });
      setIsSubmitting(false);
      
      // Redirect to home after showing success message
      setTimeout(() => {
        setSuccess(false);
        onGigPosted();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="space-y-8 relative z-10 max-w-3xl mx-auto pb-10">
      <section className="text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Post a Gig</h1>
        <p className="text-gray-500 mt-1 text-base sm:text-lg">Find the perfect talent for your next project</p>
      </section>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-10">
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-center font-medium shadow-sm">
            Gig posted successfully! Redirecting...
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Gig Title <span className="text-red-500">*</span></label>
            <input required name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g. Lead Guitarist for Studio Session" className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-gray-50 focus:bg-white" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the gig, requirements, and expectations..." className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none bg-gray-50 focus:bg-white"></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
              <input required name="location" value={formData.location} onChange={handleChange} type="text" placeholder="City, Country or Remote" className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price <span className="text-red-500">*</span></label>
              <input required name="price" value={formData.price} onChange={handleChange} type="number" placeholder="e.g. 500" className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-gray-50 focus:bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Event Date <span className="text-red-500">*</span></label>
            <input required name="event_date" value={formData.event_date} onChange={handleChange} type="date" className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Reference File <span className="text-gray-400 font-normal">(Optional)</span></label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:bg-gray-50 hover:border-blue-300 transition-colors cursor-pointer group">
              <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm text-gray-700 font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">MP3, WAV, PDF, or Image (max 10MB)</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100 shadow-md mt-4"
          >
            {isSubmitting ? 'Posting...' : 'Post Gig'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostGigTab;
