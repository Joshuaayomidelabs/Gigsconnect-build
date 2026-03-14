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
    currency: 'NGN',
    location: '',
    gig_category: GIG_CATEGORIES[0],
    deadline: ''
  });

  const getCurrencySymbol = (currency: string) => (currency === "USD" ? "$" : "₦");

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
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
        currency: formData.currency,
        location: formData.location,
        gig_category: formData.gig_category,
        deadline: formData.deadline, // HTML date input is already YYYY-MM-DD
        user_id: session.user.id,
        creator_id: session.user.id
      });

      if (error) throw error;
      navigate('/overview');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-4">Post a New <span className="text-blue-600 dark:text-blue-400">Gig</span></h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Find the perfect talent for your musical project.</p>
      </section>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 space-y-6 transition-colors">
        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
            <Music className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            Gig Title *
          </label>
          <input 
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Lead Guitarist for Afrobeats Tour"
            className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Budget *
            </label>
            <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all overflow-hidden">
              <span className="px-4 font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 h-full flex items-center py-4">
                {getCurrencySymbol(formData.currency)}
              </span>
              <input 
                required
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g. 500"
                className="w-full p-4 outline-none bg-transparent text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Currency *
            </label>
            <select 
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="NGN">Naira (₦)</option>
              <option value="USD">Dollar ($)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Location *
            </label>
            <input 
              required
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Lagos, Nigeria / Remote"
              className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Music className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Category *
            </label>
            <select 
              name="gig_category"
              value={formData.gig_category}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {GIG_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Deadline *
            </label>
            <input 
              required
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            Description *
          </label>
          <textarea 
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            placeholder="Describe the gig requirements, expectations, and any other relevant details..."
            className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 resize-none text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 font-bold hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Post Gig Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostGig;
