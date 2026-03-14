import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Music, 
  Globe, 
  Loader2, 
  Briefcase,
  ArrowLeft,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { motion } from 'motion/react';
import { profilesService } from '../services/profilesService';
import { gigsService } from '../services/gigsService';
import GigCard from '../components/GigCard';

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [gigs, setGigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const [profileRes, gigsRes] = await Promise.all([
          profilesService.getProfile(userId),
          gigsService.getMyGigs(userId)
        ]);

        if (profileRes.error) throw profileRes.error;
        setProfile(profileRes.data);
        setGigs(gigsRes.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 dark:text-blue-400" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="pt-24 pb-12 px-4 text-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-12 rounded-[3rem] shadow-xl border border-gray-200 dark:border-gray-700">
          <User className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2">Profile Not Found</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-8">{error || "The profile you're looking for doesn't exist."}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 font-bold rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-300 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-700 dark:text-gray-200 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden flex items-center justify-center mx-auto">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                  )}
                </div>
                {profile.subscription_plan === 'pro' && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-lg border-2 border-white dark:border-gray-800">
                    PRO
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-1">{profile.full_name}</h1>
              <p className="text-blue-600 dark:text-blue-400 font-bold mb-4">{profile.role || 'Music Professional'}</p>
              
              <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium mb-6">
                <MapPin className="w-4 h-4" />
                <span>{profile.city ? `${profile.city}, ${profile.country}` : profile.country || 'Global'}</span>
              </div>

              <div className="flex justify-center gap-3">
                {profile.instagram_url && (
                  <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {profile.facebook_url && (
                  <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {profile.tiktok_url && (
                  <a href={profile.tiktok_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-lg border border-gray-200 dark:border-gray-700 space-y-4">
              <h3 className="font-black text-gray-900 dark:text-gray-100 tracking-tight mb-4">Contact Information</h3>
              {profile.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium truncate">{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{profile.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Bio & Gigs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 shadow-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-6 flex items-center gap-3">
                <Music className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                About
              </h2>
              <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                {profile.bio || `${profile.full_name} hasn't added a bio yet.`}
              </p>

              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-widest">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string) => (
                      <span key={skill} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portfolio Section */}
            {profile.portfolio_media && profile.portfolio_media.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 shadow-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Portfolio
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.portfolio_media.map((item: any, index: number) => (
                    <div key={index} className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 group">
                      {item.type === 'video' ? (
                        <video 
                          src={item.url} 
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img 
                          src={item.url} 
                          alt={`Portfolio ${index + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gigs Posted Section */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Gigs Posted
              </h2>
              
              {gigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gigs.map((gig) => (
                    <GigCard 
                      key={gig.id} 
                      gig={{ ...gig, profiles: profile }} 
                      onViewDetails={(g) => navigate(`/gig/${g.id}`)}
                      showApply={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-16 text-center border border-gray-200 dark:border-gray-700 border-dashed">
                  <Briefcase className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-700 dark:text-gray-200 font-medium">No gigs posted yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
