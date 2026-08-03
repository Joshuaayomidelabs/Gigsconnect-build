import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Globe, 
  Loader2, 
  Briefcase,
  ArrowLeft,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle2,
  Clock,
  UserPlus,
  UserCheck,
  MessageCircle,
  LayoutGrid,
  Trash2,
  Plus,
  Upload,
  X,
  Star,
  Play,
  Image as ImageIcon,
  Video,
  ExternalLink,
  AlertTriangle,
  BadgeCheck,
  Heart,
  Volume2,
  VolumeX,
  Radio,
  FileText,
  MoreVertical,
  Shield,
  Flag,
  Share2,
  Edit3,
  Award,
  Sparkles,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { profilesService } from '../services/profilesService';
import { followsService } from '../services/followsService';
import { communityService } from '../services/communityService';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import VerificationBadge from '../components/VerificationBadge';
import { PremiumBadge } from '../components/PremiumBadge';
import FollowListModal from '../components/FollowListModal';
import PostCard from '../components/PostCard';
import ProfileCompletionWidget from '../components/ProfileCompletionWidget';
import { useModeration } from '../hooks/useModeration';
import { openExternalLink } from '../lib/openExternalLink';
import { generateVideoThumbnail, dataUrlToFile } from '../utils/videoUtils';
import { handleError, notifyError } from '../utils/errorHandler';
import { getOrCreateDirectConversation } from '../services/messagesService';
import { getFriendlyErrorMessage } from '../utils/errorHandler';

// TikTok Icon SVG
const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.85V7.58a6.34 6.34 0 0 0-3.55 1.01 6.37 6.37 0 1 0 9.89 5.37V9.4a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.83z"/>
  </svg>
);

// PORTFOLIO MEDIA CARD
interface PortfolioMediaCardProps {
  item: any;
  index: number;
  isOwnProfile: boolean;
  onSelect: (media: { type: string; url: string }) => void;
  onToggleFeatured: (e: React.MouseEvent, id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

const PortfolioMediaCard: React.FC<PortfolioMediaCardProps> = ({
  item,
  index,
  isOwnProfile,
  onSelect,
  onToggleFeatured,
  onDelete,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className={`relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#121214] border border-gray-200 dark:border-[#1F1F23]/80 group shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer ${
        item.is_featured ? 'ring-2 md:ring-4 ring-brand-purple ring-offset-2 dark:ring-offset-[#09090B]' : ''
      }`}
      onClick={() => onSelect({ type: item.type, url: item.url })}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200/50 dark:bg-[#18181B] animate-pulse z-0" />
      )}

      {item.type === 'video' ? (
        <div className="absolute inset-0 w-full h-full">
          <video 
            src={item.url.includes('?thumb=') || item.url.includes('&thumb=') ? item.url.replace(/[?&]thumb=[^&]+/g, '') : item.url} 
            poster={(() => {
              try {
                const match = item.url.match(/[?&]thumb=([^&]+)/);
                return match ? decodeURIComponent(match[1]) : undefined;
              } catch {
                return undefined;
              }
            })()}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
            preload="metadata"
            onLoadedData={() => setIsLoaded(true)}
            muted
            playsInline
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/35 transition-all duration-200">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-current text-white translate-x-[1px]" />
            </div>
          </div>
          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-white flex items-center gap-1">
            <Video className="w-2.5 h-2.5" />
            Highlight
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={item.url} 
            alt={`Portfolio creative work ${index + 1}`} 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-200" />
          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-white flex items-center gap-1">
            <ImageIcon className="w-2.5 h-2.5" />
            Snapshot
          </span>
        </div>
      )}

      {/* Owner controls on hover */}
      {isOwnProfile && (
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFeatured(e, item.id);
            }}
            className={`p-1.5 rounded-lg backdrop-blur-md shadow-md border active:scale-95 transition-all ${
              item.is_featured 
                ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600' 
                : 'bg-black/60 text-gray-300 border-white/10 hover:bg-black/80 hover:text-white'
            }`}
            title={item.is_featured ? "Remove Featured" : "Mark as Featured"}
          >
            <Star className={`w-3 h-3 ${item.is_featured ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e, item.id);
            }}
            className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 backdrop-blur-md shadow-md border border-white/10 active:scale-95 transition-all"
            title="Delete work"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Featured star badge statically displayed */}
      {item.is_featured && (
        <div className="absolute top-2 left-2 pointer-events-none px-2 py-0.5 bg-amber-500 text-white text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider rounded-md shadow group-hover:opacity-0 transition-opacity flex items-center gap-1 z-10">
          <Star className="w-2 h-2 fill-current" />
          Featured
        </div>
      )}
    </div>
  );
};

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [dynamicSkills, setDynamicSkills] = useState<string[]>([]);
  const [completedGigsCount, setCompletedGigsCount] = useState<number>(0);
  
  // Social Stats State
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);
  
  // Content Tab State
  const [activeTab, setActiveTab] = useState<'portfolio' | 'about' | 'posts'>('portfolio');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{type: string, url: string} | null>(null);

  // Social feed posts state
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  // Portfolio States
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'video' | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState<string | null>(null);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [portfolioItemToDelete, setPortfolioItemToDelete] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = currentUser?.id === userId;

  // Moderation triggers
  const { blockUser, reportContent, isUserBlocked, unblockUser } = useModeration();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showReportUserModal, setShowReportUserModal] = useState(false);
  const [reportUserReason, setReportUserReason] = useState('inappropriate');
  const [reportUserDetails, setReportUserDetails] = useState('');

  // File Selection for Portfolio
  const handleFileSelect = (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      notifyError("File size must be under 50MB");
      return;
    }
    
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      notifyError("Please upload an image (JPG, PNG, WebP) or video (MP4, MOV, WebM).");
      return;
    }
    
    if (isImage && file.size > 5 * 1024 * 1024) {
      notifyError("Images must be under 5MB");
      return;
    }
    
    setSelectedFile(file);
    const type = isImage ? 'image' : 'video';
    setSelectedFileType(type);
    
    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setIsGeneratingThumbnail(true);
      const localUrl = URL.createObjectURL(file);
      setFilePreview(localUrl);
      
      generateVideoThumbnail(file)
        .then(thumb => {
          setVideoThumbnailUrl(thumb);
        })
        .catch(err => {
          console.error("Failed to generate video thumbnail image:", err);
        })
        .finally(() => {
          setIsGeneratingThumbnail(false);
        });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const clearSelectedFile = () => {
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setSelectedFileType(null);
    setFilePreview(null);
    setVideoThumbnailUrl(null);
  };

  // Add Portfolio Item
  const handleAddPortfolioItem = async () => {
    if (!selectedFile || !selectedFileType || !currentUser) return;
    
    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${selectedFileType} to portfolio...`);
    
    try {
      let publicUrl = '';
      if (selectedFileType === 'video') {
         let thumbnailUrl = '';
         if (videoThumbnailUrl) {
           try {
             const thumbFile = dataUrlToFile(videoThumbnailUrl, 'thumbnail.jpg');
             const thumbFieldExt = selectedFile.name.split('.').pop() || 'mp4';
             const thumbFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${thumbFieldExt}`;
             const thumbPath = `portfolio/${currentUser.id}/thumb_${thumbFileName}.jpg`;
             
             const { error: thumbErr } = await supabase.storage
               .from('portfolio')
               .upload(thumbPath, thumbFile);
             
             if (!thumbErr) {
               thumbnailUrl = supabase.storage.from('portfolio').getPublicUrl(thumbPath).data.publicUrl;
             }
           } catch (tErr) {
             console.error("Failed to upload portfolio video thumbnail:", tErr);
           }
         }
         
         const rawVideoUrl = await profilesService.uploadPortfolioMedia(currentUser.id, selectedFile, selectedFileType);
         
         if (thumbnailUrl) {
           publicUrl = `${rawVideoUrl}?thumb=${encodeURIComponent(thumbnailUrl)}`;
         } else {
           publicUrl = rawVideoUrl;
         }
      } else {
         publicUrl = await profilesService.uploadPortfolioMedia(currentUser.id, selectedFile, selectedFileType);
      }
      
      const newItem = {
        id: Math.random().toString(36).substring(2),
        url: publicUrl,
        type: selectedFileType,
        is_featured: !profile.portfolio_media || profile.portfolio_media.length === 0
      };
      
      const currentMedia = profile.portfolio_media || [];
      const updatedMedia = [...currentMedia, newItem];
      
      const { error } = await profilesService.updateProfile({
        ...profile,
        portfolio_media: updatedMedia
      });
      
      if (error) throw error;
      
      setProfile((prev: any) => ({ ...prev, portfolio_media: updatedMedia }));
      toast.success(`${selectedFileType.charAt(0).toUpperCase() + selectedFileType.slice(1)} added to portfolio!`, { id: toastId });
      
      setShowAddModal(false);
      clearSelectedFile();
    } catch (err: any) {
      console.error(err);
      handleError(err, "Operation Error");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Portfolio Item
  const handleDeletePortfolioItem = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!profile || !currentUser) return;
    setPortfolioItemToDelete(itemId);
  };

  const handleConfirmDeletePortfolio = async () => {
    if (!portfolioItemToDelete || !profile || !currentUser) return;
    
    const itemId = portfolioItemToDelete;
    setPortfolioItemToDelete(null);
    
    const toastId = toast.loading("Deleting item...");
    try {
      const itemToDelete = profile.portfolio_media.find((m: any) => m.id === itemId);
      if (!itemToDelete) throw new Error("Item not found");
      
      const urlParts = itemToDelete.url.split('/portfolio/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1].split('?')[0];
        try {
          await profilesService.deletePortfolioMedia(filePath);
        } catch (storageErr) {
          console.warn("Could not delete file from storage, proceeding with database update anyway.", storageErr);
        }
      }
      
      const updatedMedia = profile.portfolio_media.filter((m: any) => m.id !== itemId);
      
      const { error } = await profilesService.updateProfile({
        ...profile,
        portfolio_media: updatedMedia
      });
      
      if (error) throw error;
      
      setProfile((prev: any) => ({ ...prev, portfolio_media: updatedMedia }));
      toast.success("Item deleted from portfolio", { id: toastId });
    } catch (err: any) {
      console.error(err);
      handleError(err, "Operation Error");
    }
  };

  // Toggle Featured Status
  const handleToggleFeatured = async (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!profile || !currentUser) return;
    
    const currentMedia = profile.portfolio_media || [];
    const itemToToggle = currentMedia.find((m: any) => m.id === itemId);
    if (!itemToToggle) return;
    
    const nextFeaturedVal = !itemToToggle.is_featured;
    
    const updatedMedia = currentMedia.map((item: any) => ({
      ...item,
      is_featured: item.id === itemId ? nextFeaturedVal : false
    }));
    
    const toastId = toast.loading("Updating featured status...");
    try {
      const { error } = await profilesService.updateProfile({
        ...profile,
        portfolio_media: updatedMedia
      });
      
      if (error) throw error;
      
      setProfile((prev: any) => ({ ...prev, portfolio_media: updatedMedia }));
      toast.success(nextFeaturedVal ? "Item set as featured!" : "Item removed from featured", { id: toastId });
    } catch (err: any) {
      console.error(err);
      handleError(err, "Operation Error");
    }
  };

  // Profile data fetch & Subscriptions
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);

        const [subscriptionRes, profileRes, statsData] = await Promise.all([
          supabase.from('subscriptions').select('*, plan:subscription_plans(*)').eq('user_id', userId).eq('status', 'active').order('created_at', { ascending: false }).limit(1).maybeSingle(),
          profilesService.getProfile(userId),
          followsService.getFollowStats(userId)
        ]);

        if (profileRes.error) throw profileRes.error;
        
        let fetchedCategories: string[] = [];
        let fetchedSkills: string[] = [];
        
        if (profileRes.data) {
          const profileId = profileRes.data.id;
          
          try {
            const { data: pcData } = await supabase
              .from('profile_categories')
              .select('creator_categories(name)')
              .eq('profile_id', profileId);
              
            if (pcData) {
              // @ts-ignore
              fetchedCategories = pcData.map((pc: any) => pc.creator_categories?.name).filter(Boolean);
            }
            
            const { data: psData } = await supabase
              .from('profile_skills')
              .select('skills(name)')
              .eq('profile_id', profileId);
              
            if (psData) {
              // @ts-ignore
              fetchedSkills = psData.map((ps: any) => ps.skills?.name).filter(Boolean);
            }
          } catch (err) {
            console.error('Error fetching dynamic categories/skills:', err);
          }
        }
        
        let realCompletedGigsCount = 0;
        try {
          const [appCountRes, gigCountRes] = await Promise.all([
            supabase
              .from('applications')
              .select('*', { count: 'exact', head: true })
              .eq('applicant_id', userId)
              .in('status', ['accepted', 'completed', 'Accepted', 'Completed']),
            supabase
              .from('gigs')
              .select('*', { count: 'exact', head: true })
              .eq('poster_id', userId)
              .in('status', ['completed', 'Completed'])
          ]);

          realCompletedGigsCount = (appCountRes.count || 0) + (gigCountRes.count || 0);
        } catch (e) {
          console.error("Error fetching completed gigs count:", e);
        }

        if (typeof profileRes.data?.completed_gigs === 'number' && profileRes.data.completed_gigs > 0) {
          realCompletedGigsCount = Math.max(realCompletedGigsCount, profileRes.data.completed_gigs);
        }
        
        if (isMounted) {
          setProfile(profileRes.data);
          setStats(statsData);
          setDynamicCategories(fetchedCategories);
          setDynamicSkills(fetchedSkills);
          setCompletedGigsCount(realCompletedGigsCount);
        }

        if (currentUser && !isOwnProfile) {
          const followStatus = await followsService.checkIfFollowing(currentUser.id, userId);
          if (isMounted) {
            setIsFollowing(followStatus.isFollowing);
          }
        }
      } catch (err: any) {
        if (isMounted) setError(getFriendlyErrorMessage(err));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

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
          if (isMounted) setProfile(payload.new);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId, currentUser, isOwnProfile]);

  // Fetch creator posts inside 'posts' tab dynamically
  useEffect(() => {
    if (activeTab === 'posts' && posts.length === 0 && userId) {
      const fetchPosts = async () => {
        try {
          setIsLoadingPosts(true);
          const { data, error } = await communityService.getUserPosts(userId, currentUser?.id);
          if (!error && data) {
            setPosts(data);
          }
        } catch (err) {
          console.error("Error loading user feed posts:", err);
        } finally {
          setIsLoadingPosts(false);
        }
      };
      fetchPosts();
    }
  }, [activeTab, userId, currentUser]);

  // Real-time Follow / Unfollow Handler
  
  const handleMessageClick = async () => {
    if (!currentUser) {
      toast.error('Please sign in to send messages');
      navigate('/login');
      return;
    }
    
    if (currentUser.id === profile?.id) {
      toast.error('You cannot message yourself');
      return;
    }

    try {
      setIsCreatingConversation(true);
      const conversationId = await getOrCreateDirectConversation(profile!.id);
      navigate('/messages/' + conversationId);
    } catch (err: any) {
      handleError(err, 'Failed to start conversation');
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      notifyError("Please sign in to follow creators.");
      return;
    }
    if (!userId || isTogglingFollow) return;

    setIsTogglingFollow(true);
    const currentlyFollowing = isFollowing;
    const newFollowingState = !currentlyFollowing;

    // Optimistic UI Update
    setIsFollowing(newFollowingState);
    setStats(prev => ({
      ...prev,
      followers: newFollowingState ? prev.followers + 1 : Math.max(0, prev.followers - 1)
    }));

    try {
      const { error } = await followsService.toggleFollow(currentUser.id, userId, currentlyFollowing);
      
      if (error) {
        // Revert on error
        setIsFollowing(currentlyFollowing);
        setStats(prev => ({
          ...prev,
          followers: currentlyFollowing ? prev.followers + 1 : Math.max(0, prev.followers - 1)
        }));
        notifyError("Failed to update follow status. Please try again.");
      } else {
        if (newFollowingState) {
          toast.success(`You are now following ${profile?.full_name || 'this creator'}!`);
        } else {
          toast.info(`Unfollowed ${profile?.full_name || 'creator'}.`);
        }
      }
    } catch (err: any) {
      console.error('Error toggling follow:', err);
      setIsFollowing(currentlyFollowing);
      setStats(prev => ({
        ...prev,
        followers: currentlyFollowing ? prev.followers + 1 : Math.max(0, prev.followers - 1)
      }));
      notifyError("An error occurred. Please try again.");
    } finally {
      setIsTogglingFollow(false);
    }
  };

  // Render Social Links Bar
  const renderSocialLinks = () => {
    if (!profile) return null;

    const links = [
      { name: 'Instagram', url: profile.instagram_url, icon: Instagram, color: 'hover:text-pink-500 hover:bg-pink-500/10 dark:hover:bg-pink-500/20' },
      { name: 'Twitter', url: profile.twitter_url, icon: Twitter, color: 'hover:text-sky-400 hover:bg-sky-400/10 dark:hover:bg-sky-400/20' },
      { name: 'LinkedIn', url: profile.linkedin_url, icon: Linkedin, color: 'hover:text-blue-600 hover:bg-blue-600/10 dark:hover:bg-blue-600/20' },
      { name: 'TikTok', url: profile.tiktok_url, icon: TikTokIcon, color: 'hover:text-rose-400 hover:bg-rose-400/10 dark:hover:bg-rose-400/20' },
      { name: 'Facebook', url: profile.facebook_url, icon: Facebook, color: 'hover:text-blue-500 hover:bg-blue-500/10 dark:hover:bg-blue-500/20' },
      { name: 'Website', url: profile.website_url || profile.website, icon: Globe, color: 'hover:text-brand-purple hover:bg-brand-purple/10 dark:hover:bg-brand-purple/20' },
    ].filter(link => !!link.url);

    if (links.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
        {links.map((link) => {
          const IconComponent = link.icon;
          let formattedUrl = link.url;
          if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
            formattedUrl = `https://${formattedUrl}`;
          }
          return (
            <a
              key={link.name}
              href={formattedUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                openExternalLink(formattedUrl);
              }}
              className={`p-2.5 rounded-xl bg-gray-100 dark:bg-[#1A1A1E] text-gray-600 dark:text-gray-300 transition-all ${link.color} active:scale-95 border border-gray-200/70 dark:border-[#27272A] shadow-sm`}
              title={`${link.name}: ${link.url}`}
            >
              <IconComponent className="w-4 h-4" />
            </a>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] transition-colors">
        <Loader2 className="w-12 h-12 animate-spin text-brand-purple mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-600">Loading Creator Profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="pt-main pb-12 px-4 text-center min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex items-center justify-center transition-colors">
        <div id="not-found-card" className="max-w-md w-full bg-white dark:bg-brand-dark-card p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-[#1F1F23]">
          <User className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-2">Profile Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">{error || "The creator profile you search for doesn't exist or was removed."}</p>
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-brand-purple text-white font-extrabold rounded-2xl hover:bg-brand-purple-hover active:scale-95 shadow-md shadow-brand-purple/10 transition-all cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (userId && isUserBlocked(userId)) {
    return (
      <div className="pt-main pb-12 px-4 text-center min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex items-center justify-center transition-colors">
        <div id="blocked-user-card" className="max-w-md w-full bg-white dark:bg-brand-dark-card p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-[#1F1F23]">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-2">Creator Blocked</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
            You blocked this user. If you'd like to see their content or profile card again, tap the button below.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={async () => {
                if (window.confirm("Do you want to unblock this creator?")) {
                  await unblockUser(userId, profile?.full_name || 'Creator');
                }
              }}
              className="w-full py-4 bg-brand-purple text-white font-extrabold rounded-2xl hover:bg-brand-purple-hover active:scale-95 shadow-md shadow-brand-purple/10 transition-all cursor-pointer shadow-lg"
            >
              Unblock Creator
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="w-full py-4 bg-gray-150 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-extrabold rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Formatting username handle
  const usernameHandle = profile.username
    ? `@${profile.username.replace(/^@/, '')}`
    : (profile.full_name ? `@${profile.full_name.toLowerCase().replace(/\s+/g, '')}` : '');

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#09090B] min-h-screen pt-16 sm:pt-20 pb-16 transition-colors duration-500 font-sans">
      
      {/* 1. TOP COVER BANNER */}
      <div id="profile-cover" className="h-52 sm:h-64 bg-gradient-to-br from-[#8B5CF6]/90 via-[#6D28D9]/95 to-[#4C1D95]/95 w-full relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 top-1/4 bg-radial-gradient from-transparent to-black/20 pointer-events-none" />
        <div className="absolute top-10 left-10 w-44 h-44 rounded-full bg-brand-purple/20 blur-3xl" />
        <div className="absolute right-20 bottom-5 w-60 h-60 rounded-full bg-indigo-500/25 blur-3xl" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-full flex items-start justify-between pt-6 relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-11 h-11 bg-black/20 backdrop-blur-md rounded-2xl text-white border border-white/10 hover:bg-black/40 active:scale-95 transition-all shadow-sm shadow-black/10 z-10 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Profile link copied to clipboard!");
              }}
              className="flex items-center justify-center w-11 h-11 bg-black/20 backdrop-blur-md rounded-2xl text-white border border-white/10 hover:bg-black/40 active:scale-95 transition-all shadow-sm shadow-black/10 z-10 cursor-pointer"
              title="Share profile"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {isOwnProfile && (
              <span className="px-3.5 py-1.5 flex items-center gap-1.5 bg-white/20 backdrop-blur-md rounded-xl text-white text-[11px] font-black uppercase tracking-wider border border-white/15">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                Live Profile
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. CREATOR PROFILE HEADER CARD */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 relative -mt-16 sm:-mt-20 z-10">
        <div id="profile-card" className="bg-white dark:bg-brand-dark-card rounded-[2.25rem] shadow-xl border border-gray-100 dark:border-[#1F1F23]/80 p-6 sm:p-10 mb-8 relative">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
            {/* Avatar block with gradient ring & badge */}
            <div id="user-avatar" className="relative group/avatar">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-brand-dark-card shadow-xl overflow-hidden bg-[#FAFAFA] dark:bg-[#0F0F12] flex-shrink-0 flex items-center justify-center relative transition-transform duration-300 group-hover/avatar:scale-[1.02] ring-4 ring-brand-purple/20">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.full_name} 
                    className="w-full h-full object-cover object-center" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <User className="w-14 h-14 text-gray-300 dark:text-gray-700" />
                )}
              </div>
              
              {profile.verification_status === 'verified' && (
                <div className="absolute bottom-1 right-1 z-20 bg-brand-purple text-white p-1.5 rounded-full border-4 border-white dark:border-brand-dark-card shadow" title="Verified Creator">
                  <BadgeCheck className="w-5 h-5 text-white fill-current" />
                </div>
              )}
            </div>

            {/* Creator Identity Details */}
            <div className="text-center sm:text-left flex-1 min-w-0 w-full flex flex-col justify-center pt-2">
              
              {/* Creator Name & Username */}
              <div className="mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-brand-black dark:text-brand-white tracking-tight leading-tight truncate">
                    {profile.full_name || 'Anonymous Creator'}
                  </h1>
                  {profile.verification_status === 'verified' && (
                    <span title="Verified Creator" className="inline-flex items-center justify-center bg-blue-500 text-white rounded-full p-1 shadow-sm shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                  {profile.active_subscription ? (
                    <PremiumBadge planName={profile.active_subscription.plan?.name || profile.active_subscription.plan_name} />
                  ) : (
                    <PremiumBadge planName={profile.subscription_plan || 'Starter'} />
                  )}
                </div>

                {usernameHandle && (
                  <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mt-0.5">
                    {usernameHandle}
                  </p>
                )}
              </div>

              {/* Creator Categories / Role */}
              {(dynamicCategories.length > 0 || profile.role) && (
                <div className="mb-3 flex flex-wrap justify-center sm:justify-start gap-2">
                  {(dynamicCategories.length > 0 ? dynamicCategories : (profile.role ? [profile.role] : [])).map((cat: string) => (
                    <span key={cat} className="px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-widest">
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              {/* Skills Chips */}
              {(dynamicSkills.length > 0 || (profile.skills && profile.skills.length > 0)) && (
                <div className="mb-4 flex flex-wrap justify-center sm:justify-start gap-2">
                  {(dynamicSkills.length > 0 ? dynamicSkills : profile.skills).slice(0, 6).map((skill: string) => (
                    <span key={skill} className="px-3.5 py-1 bg-[#F9FAFB] dark:bg-[#161618] rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#27272A] shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Location & Availability */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6 text-sm font-semibold text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-purple shrink-0" />
                  <span>{profile.city_town || profile.city ? `${profile.city_town || profile.city}, ${profile.country || ''}` : profile.country || 'Global Creator'}</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Available for gigs</span>
                </div>
              </div>

              {/* Bio Summary */}
              {profile.bio && (
                <p className="mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed font-medium">
                  {profile.bio}
                </p>
              )}

              {/* Social Links Bar */}
              {renderSocialLinks()}

            </div>
          </div>

          {/* 3. AUTHENTIC STATS AREA */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-around gap-4 sm:gap-8 border-t border-b border-gray-100 dark:border-[#1F1F23]/80 py-5 my-6">
            
            {/* Real Followers Count */}
            <div 
              className="flex flex-col items-center cursor-pointer group/stat p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              onClick={() => setShowFollowersModal(true)}
            >
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-purple" />
                <span className="text-xl font-black text-brand-black dark:text-brand-white group-hover/stat:text-brand-purple transition-colors">
                  {stats.followers >= 1000 ? (stats.followers / 1000).toFixed(1) + 'K' : stats.followers}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-0.5">Followers</span>
            </div>
            
            {/* Real Following Count */}
            <div 
              className="flex flex-col items-center cursor-pointer group/stat p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              onClick={() => setShowFollowingModal(true)}
            >
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-500" />
                <span className="text-xl font-black text-brand-black dark:text-brand-white group-hover/stat:text-brand-purple transition-colors">
                  {stats.following >= 1000 ? (stats.following / 1000).toFixed(1) + 'K' : stats.following}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-0.5">Following</span>
            </div>

            {/* Real Portfolio Items Count */}
            <div className="flex flex-col items-center p-2">
              <div className="flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4 text-sky-500" />
                <span className="text-xl font-black text-brand-black dark:text-brand-white">
                  {profile.portfolio_media?.length || 0}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-0.5">Portfolio Work</span>
            </div>

            {/* Real Completed Gigs (ONLY shown if > 0) */}
            {completedGigsCount > 0 && (
              <div className="flex flex-col items-center p-2">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span className="text-xl font-black text-brand-black dark:text-brand-white">{completedGigsCount}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-0.5">Gigs Completed</span>
              </div>
            )}

            {/* Real Rating (ONLY shown if > 0) */}
            {typeof profile?.rating === 'number' && profile.rating > 0 && (
              <div className="flex flex-col items-center p-2">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-xl font-black text-brand-black dark:text-brand-white">{profile.rating}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-0.5">Rating</span>
              </div>
            )}
          </div>
          
          {/* 4. ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isOwnProfile ? (
              <>
                <button 
                  onClick={handleFollowToggle}
                  disabled={isTogglingFollow}
                  className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer ${
                    isFollowing
                      ? 'bg-gray-100 dark:bg-[#1F1F23] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#27272A] hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-200'
                      : 'bg-brand-purple text-white hover:bg-brand-purple-hover shadow-brand-purple/20'
                  }`}
                >
                  {isTogglingFollow ? (
                    <Loader2 className="w-4 h-4 animate-spin text-current" />
                  ) : isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={handleMessageClick}
                  disabled={isCreatingConversation}
                  className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-brand-black dark:bg-white text-white dark:text-brand-black font-bold text-sm transition-all hover:opacity-90 shadow-md active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-[#1F1F23] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#27272A] transition-all cursor-pointer"
                    title="More options"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 bottom-14 w-48 bg-white dark:bg-[#1A1A1E] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#2A2A2F] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Profile URL copied to clipboard!");
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4 text-gray-400" />
                        Share Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowReportUserModal(true);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 flex items-center gap-2"
                      >
                        <Flag className="w-4 h-4" />
                        Report Profile
                      </button>
                      <button
                        onClick={async () => {
                          setShowProfileMenu(false);
                          if (window.confirm(`Are you sure you want to block ${profile.full_name || 'this creator'}?`)) {
                            await blockUser(profile.id, profile.full_name || 'Creator');
                          }
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Block Creator
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => navigate('/edit-profile')}
                  className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-gray-100 dark:bg-[#1F1F23] text-brand-black dark:text-white font-bold text-sm transition-all hover:bg-gray-200 dark:hover:bg-[#27272A] active:scale-95 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-brand-purple" />
                  Edit Profile
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('portfolio');
                    setShowAddModal(true);
                  }}
                  className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-brand-purple text-white font-bold text-sm transition-all hover:bg-brand-purple-hover active:scale-95 shadow-md shadow-brand-purple/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Upload Work
                </button>
              </div>
            )}
          </div>
        </div>

        {isOwnProfile && <ProfileCompletionWidget profile={profile} onOpenPortfolio={() => {
          setActiveTab('portfolio');
          setShowAddModal(true);
        }} />}

        {/* 5. CONTENT NAVIGATION TABS */}
        <div className="sticky top-[4.2rem] sm:top-[5rem] z-30 bg-[#FAFAFA]/90 dark:bg-[#09090B]/90 backdrop-blur-md py-4 border-b border-gray-100 dark:border-[#1F1F23] mb-6">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider relative transition-colors duration-300 cursor-pointer ${
                activeTab === 'portfolio' 
                  ? 'text-brand-purple' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Portfolio ({profile.portfolio_media?.length || 0})
              {activeTab === 'portfolio' && (
                <motion.div 
                  layoutId="activeTabUnderline" 
                  className="absolute -bottom-4 left-0 right-0 h-[3px] bg-brand-purple rounded-full" 
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider relative transition-colors duration-300 cursor-pointer ${
                activeTab === 'about' 
                  ? 'text-brand-purple' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <User className="w-4 h-4" />
              About & Skills
              {activeTab === 'about' && (
                <motion.div 
                  layoutId="activeTabUnderline" 
                  className="absolute -bottom-4 left-0 right-0 h-[3px] bg-brand-purple rounded-full" 
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider relative transition-colors duration-300 cursor-pointer ${
                activeTab === 'posts' 
                  ? 'text-brand-purple' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              Posts
              {activeTab === 'posts' && (
                <motion.div 
                  layoutId="activeTabUnderline" 
                  className="absolute -bottom-4 left-0 right-0 h-[3px] bg-brand-purple rounded-full" 
                />
              )}
            </button>
          </div>
        </div>

        {/* 6. TABBED CONTENT CONTENT AREA */}
        <div className="min-h-[400px]">
          
          {/* TAB 1: PORTFOLIO RECORDS */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-wider flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-brand-purple" />
                  Portfolio Showcase
                </h3>
                {isOwnProfile && (
                  <button
                    id="add-work-btn"
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-brand-purple to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-[#7C3AED] hover:to-[#4F46E5] active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Upload Work
                  </button>
                )}
              </div>

              {profile.portfolio_media && profile.portfolio_media.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {profile.portfolio_media.map((item: any, index: number) => (
                    <PortfolioMediaCard
                      key={item.id || index}
                      item={item}
                      index={index}
                      isOwnProfile={isOwnProfile}
                      onSelect={setSelectedMedia}
                      onToggleFeatured={handleToggleFeatured}
                      onDelete={handleDeletePortfolioItem}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-12 text-center border border-gray-150 dark:border-[#1F1F23]">
                  <LayoutGrid className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-brand-black dark:text-brand-white mb-1">No portfolio uploaded yet</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    {isOwnProfile 
                      ? "Upload photos and video clips of your work to show potential clients your talent." 
                      : "This creator hasn't uploaded any portfolio items yet."}
                  </p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-brand-purple text-white font-bold rounded-2xl hover:bg-brand-purple-hover active:scale-95 transition-all shadow-md shadow-brand-purple/10 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Portfolio Work
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ABOUT & SKILLS */}
          {activeTab === 'about' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Bio Card */}
              <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-[#1F1F23] shadow-sm">
                <h3 className="text-base font-black text-brand-black dark:text-brand-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-purple" />
                  About Creator
                </h3>
                {profile.bio ? (
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                    No biography provided yet.
                  </p>
                )}
              </div>

              {/* Skills Card */}
              <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-[#1F1F23] shadow-sm">
                <h3 className="text-base font-black text-brand-black dark:text-brand-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-purple" />
                  Skills & Expertise
                </h3>
                {(dynamicSkills.length > 0 || (profile.skills && profile.skills.length > 0)) ? (
                  <div className="flex flex-wrap gap-2.5">
                    {(dynamicSkills.length > 0 ? dynamicSkills : profile.skills).map((skill: string) => (
                      <span key={skill} className="px-4 py-2 bg-brand-purple/5 dark:bg-brand-purple/10 text-brand-purple dark:text-purple-300 rounded-2xl text-xs font-bold border border-brand-purple/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 text-sm italic">No skills listed yet.</p>
                )}
              </div>

              {/* Details & Verification Grid */}
              <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-[#1F1F23] shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-purple" /> Location
                  </h4>
                  <p className="text-sm font-bold text-brand-black dark:text-brand-white">
                    {profile.city_town || profile.city ? `${profile.city_town || profile.city}, ${profile.country || ''}` : profile.country || 'Global Creator'}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-brand-purple" /> Account Status
                  </h4>
                  <p className="text-sm font-bold text-brand-black dark:text-brand-white flex items-center gap-1.5">
                    {profile.verification_status === 'verified' ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" /> Verified Creator
                      </span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">Standard Creator Account</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNITY POSTS */}
          {activeTab === 'posts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-wider flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-brand-purple" />
                Latest Feed Updates
              </h3>

              {isLoadingPosts ? (
                <div className="space-y-4">
                  {[1, 2].map(n => (
                    <div key={n} className="bg-white dark:bg-brand-dark-card p-6 rounded-3xl animate-pulse border border-gray-100 dark:border-[#1F1F23]/80 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                        <div className="space-y-2">
                          <div className="h-3.5 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
                          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
                        </div>
                      </div>
                      <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                    </div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-4 max-w-[600px] mx-auto">
                  {posts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      onDelete={(deletedId) => {
                        setPosts(prev => prev.filter(p => p.id !== deletedId));
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-12 text-center border border-gray-150 dark:border-[#1F1F23]">
                  <Radio className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 font-bold text-sm">No updates posted on feed yet.</p>
                  {isOwnProfile && (
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple text-white hover:bg-brand-purple-hover font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Create first post
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* 7. UPLOAD PORTFOLIO WORK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9990] p-4">
          <div className="w-full max-w-md bg-white dark:bg-brand-dark-card rounded-[2rem] shadow-2xl border border-gray-100 dark:border-[#2A2A2F] overflow-hidden animate-in fade-in zoom-in-95 duration-250">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-105 dark:border-[#1F1F23] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-brand-black dark:text-brand-white">Add Past Work</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Showcase your live vibes & talent</p>
              </div>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  clearSelectedFile();
                }}
                disabled={isUploading}
                className="p-1 px-1.5 hover:bg-gray-100 dark:hover:bg-[#1F1F23]/60 rounded-lg text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {!selectedFile ? (
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    dragActive 
                      ? 'border-[#6C2BD9] bg-[#6C2BD9]/5' 
                      : 'border-gray-250 dark:border-[#2A2A2F] hover:border-[#6C2BD9]/40 hover:bg-gray-50/50 dark:hover:bg-[#1A1A1E]/30'
                  }`}
                  onClick={() => document.getElementById('portfolio-file-upload')?.click()}
                >
                  <input 
                    id="portfolio-file-upload"
                    type="file" 
                    className="hidden" 
                    accept="image/*,video/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                  <Upload className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-750 dark:text-gray-200 mb-1">
                    Drag and drop your media, or <span className="text-brand-purple hover:underline">browse</span>
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 flex flex-col gap-0.5 leading-normal mt-2.5">
                    <span>Supports high-quality images and video highlights</span>
                    <span>JPEG, PNG, WebP up to 5MB</span>
                    <span>MP4, MOV, WebM up to 50MB</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5 dark:bg-black/30 border border-gray-200 dark:border-[#2A2A2F] flex items-center justify-center">
                    {selectedFileType === 'image' ? (
                      <img src={filePreview || ''} alt="Preview" className="w-full h-full object-contain animate-fade-in" />
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        {isGeneratingThumbnail ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
                            <span className="text-[11px] text-gray-400">Generating video preview image...</span>
                          </div>
                        ) : (
                          <video 
                            src={filePreview || ''} 
                            poster={videoThumbnailUrl || undefined} 
                            className="w-full h-full object-contain animate-fade-in" 
                            controls 
                          />
                        )}
                      </div>
                    )}
                    
                    {!isUploading && (
                      <button
                        onClick={clearSelectedFile}
                        className="absolute top-2.5 right-2.5 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs px-1 text-gray-500 dark:text-gray-400">
                    <span className="font-semibold truncate max-w-[250px]">{selectedFile.name}</span>
                    <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-105 dark:border-[#1F1F23] flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-[#1A1A1E]/10">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  clearSelectedFile();
                }}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddPortfolioItem}
                disabled={!selectedFile || isUploading}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-brand-purple hover:bg-brand-purple-hover text-white disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 shadow-md hover:shadow-brand-purple/10 active:scale-95 transition-all cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload to Portfolio'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. FOLLOWERS & FOLLOWING MODALS */}
      {userId && showFollowersModal && (
        <FollowListModal 
          userId={userId} 
          type="followers" 
          onClose={() => setShowFollowersModal(false)} 
        />
      )}

      {userId && showFollowingModal && (
        <FollowListModal 
          userId={userId} 
          type="following" 
          onClose={() => setShowFollowingModal(false)} 
        />
      )}

      {/* 9. MEDIA LIGHTBOX PREVIEW */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 cursor-pointer"
        >
          <button 
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {selectedMedia.type === "image" && (
            <img
              src={selectedMedia.url}
              alt="Expanded preview"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl animate-in zoom-in-95 duration-200"
            />
          )}

          {selectedMedia.type === "video" && (
            <div className="max-w-[500px] w-full max-h-[90vh] aspect-[9/16] rounded-2xl overflow-hidden bg-black select-none" onClick={(e) => e.stopPropagation()}>
              <video
                src={selectedMedia.url.includes('?thumb=') ? selectedMedia.url.split('?thumb=')[0] : selectedMedia.url}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      )}

      {/* 10. DELETE ITEM CONFIRMATION MODAL */}
      <AnimatePresence>
        {portfolioItemToDelete && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-brand-dark-card p-6 sm:p-8 rounded-[2.25rem] max-w-sm w-full shadow-2xl border border-gray-150 dark:border-[#2A2A2F] text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-6 text-red-600 dark:text-red-400 mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-brand-black dark:text-brand-white mb-2">Delete Portfolio Item?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mb-6">
                Are you sure you want to remove this item from your portfolio?
              </p>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setPortfolioItemToDelete(null)}
                  className="flex-1 py-3.5 px-4 rounded-xl border border-gray-200 dark:border-brand-black text-brand-black dark:text-brand-white text-sm font-bold hover:bg-[#FAFAFA] dark:hover:bg-brand-black active:scale-95 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleConfirmDeletePortfolio}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold active:scale-95 transition-all text-center flex items-center justify-center gap-2 shadow-md hover:shadow-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 11. REPORT USER MODAL */}
      {showReportUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1E] rounded-[2.5rem] w-full max-w-md overflow-hidden border border-gray-100 dark:border-[#2A2A2F] p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowReportUserModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Report Offensive Profile</h3>
            
            <div className="space-y-4 font-sans text-left">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Objectionable Reason</label>
                <select 
                  value={reportUserReason}
                  onChange={(e) => setReportUserReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#1F1F23] bg-transparent text-brand-black dark:text-brand-white text-sm outline-none font-medium"
                >
                  <option value="spam">Spam / Scam Account</option>
                  <option value="harassment">Harassment or Cyberbullying</option>
                  <option value="inappropriate">Inappropriate bio or media</option>
                  <option value="intellectual">IP, Theft, Fake Identity</option>
                  <option value="other">Other objectionable activity</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Report Context (Optional)</label>
                <textarea 
                  value={reportUserDetails}
                  onChange={(e) => setReportUserDetails(e.target.value)}
                  placeholder="Describe your concern with this creator profile..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#1F1F23] bg-transparent text-brand-black dark:text-brand-white text-sm outline-none font-medium resize-none text-left"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowReportUserModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    if (!profile) return;
                    const success = await reportContent('profile', profile.user_id || profile.id, reportUserReason, reportUserDetails);
                    if (success) {
                      setShowReportUserModal(false);
                      setReportUserDetails('');
                    }
                  }}
                  className="flex-1 py-3 rounded-xl font-bold bg-brand-purple text-white transition-all hover:bg-brand-purple-hover cursor-pointer"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PublicProfile;
