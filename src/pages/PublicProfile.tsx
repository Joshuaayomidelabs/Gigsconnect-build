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
  Twitter,
  CheckCircle2,
  Music2,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { profilesService } from '../services/profilesService';
import { gigsService } from '../services/gigsService';
import { supabase } from '../services/supabaseClient';
import GigCard from '../components/GigCard';

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [gigs, setGigs] = useState<any[]>([]);
  const [appliedGigIds, setAppliedGigIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch applied gig IDs
          const { data: applications } = await supabase
            .from('gig_applications')
            .select('gig_id')
            .eq('applicant_id', session.user.id);
          
          if (applications) {
            setAppliedGigIds(new Set(applications.map(app => app.gig_id)));
          }
        }

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

    // Realtime subscription for profile updates (verification status, etc.)
    const channel = supabase
      .channel(`public-profile-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          setProfile(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="pt-24 pb-12 px-4 text-center min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
        <div className="max-w-md mx-auto bg-brand-white dark:bg-brand-dark-card p-12 rounded-[3rem] shadow-xl border border-brand-gray dark:border-brand-black">
          <User className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-2">Profile Not Found</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-8">{error || "The profile you're looking for doesn't exist."}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-brand-purple text-brand-white font-bold rounded-2xl hover:bg-brand-purple-hover transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-gray dark:bg-brand-black min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-brand-black dark:text-brand-white font-bold hover:text-brand-purple transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] p-8 shadow-xl border border-brand-gray dark:border-brand-black overflow-hidden text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-brand-gray dark:bg-brand-black border-4 border-brand-white dark:border-brand-dark-card shadow-lg overflow-hidden flex items-center justify-center mx-auto">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url.includes('?') ? profile.avatar_url : `${profile.avatar_url}?t=${Date.now()}`} 
                      alt={profile.full_name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                  )}
                </div>
                {(profile.verification_status === 'Verified' || profile.is_verified) && (
                  <div className="absolute -bottom-1 -right-1 bg-brand-purple text-brand-white p-2 rounded-full border-4 border-brand-white dark:border-brand-dark-card shadow-lg" title="Verified Professional">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </div>

              <h1 className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tight mb-1">{profile.full_name}</h1>
              
              {profile.verification_status === 'Pending' && (
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-600 dark:text-yellow-400 text-xs font-bold rounded-xl mb-4 border border-yellow-100 dark:border-yellow-900/20">
                  <Clock className="w-4 h-4" />
                  Verification Pending
                </div>
              )}

              <p className="text-brand-purple font-bold mb-4">{profile.role || 'Music Professional'}</p>
              
              <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium mb-6">
                <MapPin className="w-4 h-4" />
                <span>{profile.city ? `${profile.city}, ${profile.country}` : profile.country || 'Global'}</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2rem] p-8 shadow-lg border border-brand-gray dark:border-brand-black space-y-4">
              <h3 className="font-black text-brand-black dark:text-brand-white tracking-tight mb-4">Contact Information</h3>
              {profile.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-brand-purple" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium truncate">{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-brand-purple" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{profile.phone}</span>
                </div>
              )}

              {(profile.instagram_url || profile.facebook_url || profile.tiktok_url) && (
                <div className="pt-4 border-t border-brand-gray dark:border-brand-black">
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Social Media</p>
                  <div className="flex gap-3">
                    {profile.instagram_url && (
                      <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-brand-gray dark:bg-brand-black text-gray-500 dark:text-gray-400 hover:bg-brand-purple/5 dark:hover:bg-brand-purple/20 hover:text-brand-purple transition-all border border-transparent hover:border-brand-purple/10">
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {profile.facebook_url && (
                      <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-brand-gray dark:bg-brand-black text-gray-500 dark:text-gray-400 hover:bg-brand-purple/5 dark:hover:bg-brand-purple/20 hover:text-brand-purple transition-all border border-transparent hover:border-brand-purple/10">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {profile.tiktok_url && (
                      <a href={profile.tiktok_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-brand-gray dark:bg-brand-black text-gray-500 dark:text-gray-400 hover:bg-brand-purple/5 dark:hover:bg-brand-purple/20 hover:text-brand-purple transition-all border border-transparent hover:border-brand-purple/10">
                        <Music2 className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Bio & Gigs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] p-10 shadow-xl border border-brand-gray dark:border-brand-black">
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tight mb-6 flex items-center gap-3">
                <Music className="w-6 h-6 text-brand-purple" />
                About
              </h2>
              <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                {profile.bio || `${profile.full_name} hasn't added a bio yet.`}
              </p>

              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-bold text-brand-black dark:text-brand-white mb-4 uppercase tracking-widest">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string) => (
                      <span key={skill} className="px-4 py-2 bg-brand-gray dark:bg-brand-black rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 border border-brand-gray dark:border-brand-black">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portfolio Section */}
            {profile.portfolio_media && profile.portfolio_media.length > 0 && (
              <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] p-10 shadow-xl border border-brand-gray dark:border-brand-black">
                <h2 className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tight mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-brand-purple" />
                  Portfolio
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.portfolio_media.map((item: any, index: number) => (
                    <div key={index} className="relative aspect-video rounded-2xl overflow-hidden bg-brand-gray dark:bg-brand-black border border-brand-gray dark:border-brand-black group">
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
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tight mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-brand-purple" />
                Gigs Posted
              </h2>
              
              {gigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gigs.map((gig) => (
                    <GigCard 
                      key={gig.id} 
                      gig={{ ...gig, poster: profile }} 
                      onViewDetails={(g) => navigate(`/gig/${g.id}`)}
                      showApply={false}
                      initialIsApplied={appliedGigIds.has(gig.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2.5rem] p-16 text-center border border-brand-gray dark:border-brand-black border-dashed">
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
