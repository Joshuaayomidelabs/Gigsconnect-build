import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Music, MapPin, DollarSign, Calendar, FileText } from 'lucide-react';
import { gigsService } from '../services/gigsService';
import { supabase } from '../services/supabaseClient';
import { GIG_CATEGORIES } from '../utils/constants';

const PostGig: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    gig_category: GIG_CATEGORIES[0],
    deadline: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to post a gig');

      const { error } = await gigsService.createGig({
        ...formData,
        budget: parseFloat(formData.budget),
        creator_id: session.user.id
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto min-h-screen">
      <section className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Post a New Gig</h1>
        <p className="text-gray-500 text-lg">Find the perfect talent for your musical project.</p>
      </section>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Music className="w-4 h-4 text-brand-600" />
            Gig Title *
          </label>
          <input 
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Lead Guitarist for Afrobeats Tour"
            className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-brand-600" />
              Budget (USD) *
            </label>
            <input 
              required
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g. 500"
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" />
              Location *
            </label>
            <input 
              required
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Lagos, Nigeria / Remote"
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Music className="w-4 h-4 text-brand-600" />
              Category *
            </label>
            <select 
              name="gig_category"
              value={formData.gig_category}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
            >
              {GIG_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              Deadline *
            </label>
            <input 
              required
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            Description *
          </label>
          <textarea 
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            placeholder="Describe the gig requirements, expectations, and any other relevant details..."
            className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white resize-none"
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Post Gig Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostGig;
