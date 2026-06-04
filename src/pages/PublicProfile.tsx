import React, { useState, useEffect, useRef } from 'react';
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
  Linkedin,
  CheckCircle2,
  Music2,
  Clock,
  UserPlus,
  UserCheck,
  MessageCircle,
  LayoutGrid,
  Bookmark,
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
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { profilesService } from '../services/profilesService';
import { followsService } from '../services/followsService';
import { communityService } from '../services/communityService';
import { applicationsService } from '../services/applicationsService';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import VerificationBadge from '../components/VerificationBadge';
import FollowListModal from '../components/FollowListModal';
import PostCard from '../components/PostCard';

// AUTOPLAYING VIDEO COMPONENT WITH INTERSECTION OBSERVER (TIKTOK EXPERIENCE)
interface AutoplayVideoCardProps {
  url: string;
  thumbnailUrl?: string;
  title: string;
  likesCount?: number;
  commentsCount?: number;
  isOwn?: boolean;
  onDelete?: () => void;
  onClick: () => void;
}

const AutoplayVideoCard: React.FC<AutoplayVideoCardProps> = ({
  url,
  thumbnailUrl,
  title,
  likesCount = 0,
  commentsCount = 0,
  isOwn = false,
  onDelete,
  onClick
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.play()
              .then(() => setIsPlaying(true))
              .catch((err) => {
                console.log("Autoplay blocked by client context:", err);
                setIsPlaying(false);
              });
          } else {
            videoElement.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoElement);

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      observer.disconnect();
      if (videoElement) {
        videoElement.removeEventListener('waiting', handleWaiting);
        videoElement.removeEventListener('playing', handlePlaying);
        videoElement.removeEventListener('pause', handlePause);
      }
    };
  }, [url]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div 
      className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-black group shadow-lg border border-gray-100 dark:border-[#1F1F23]/80 cursor-pointer snap-start transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      onClick={onClick}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={url}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        poster={thumbnailUrl}
        className="w-full h-full object-cover"
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
          <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
        </div>
      )}

      {/* Play indicator fallback */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none z-10">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            <Play className="w-6 h-6 fill-current text-white translate-x-[1px]" />
          </div>
        </div>
      )}

      {/* Muted/Unmuted Floating Indicator */}
      <button
        onClick={toggleMute}
        className="absolute top-3.5 right-3.5 z-25 p-2 rounded-xl bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 active:scale-90 transition-all"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Custom delete buttons on video overlay if owned */}
      {isOwn && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-3.5 left-3.5 z-25 p-2 rounded-xl bg-red-600/90 text-white border border-white/10 hover:bg-red-700 active:scale-95 transition-all shadow-md group-hover:scale-105"
          title="Delete video"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {/* Full ambient visual gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none z-10" />

      {/* Metadata content */}
      <div className="absolute bottom-4 left-4 right-4 z-20 text-white pointer-events-none space-y-1.5">
        <p className="text-xs font-black tracking-wide text-brand-purple uppercase flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse"></span>
          Live Session
        </p>
        <p className="text-sm font-bold leading-snug line-clamp-2 drop-shadow">
          {title || "Original Audio Session"}
        </p>

        {/* Dynamic Engagement indicators */}
        <div className="flex items-center gap-3.5 text-xs text-white/95 pt-1">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="font-extrabold">{likesCount}</span>
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4 text-sky-400 fill-[#38BDF8]/10" />
            <span className="font-extrabold">{commentsCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// PORTFOLIO MEDIA CARD WITH LOAD STATE OPTIMIZATION (PREVENT CLS & LAYOUT SHIFTS)
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
      {/* Absolute background placeholder to maintain visual footprint without laying out layout shifts */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200/50 dark:bg-[#18181B] animate-pulse z-0" />
      )}

      {item.type === 'video' ? (
        <div className="absolute inset-0 w-full h-full">
          <video 
            src={item.url} 
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

      {/* Owner editing controls on hover */}
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
            className="p-1.5 rounded-lg bg-red-650 text-white hover:bg-red-700 backdrop-blur-md shadow-md border border-white/10 active:scale-95 transition-all"
            title="Delete past work"
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
  const [appliedGigIds, setAppliedGigIds] = useState<Set<string>>(new Set());
  
  // Social Stats State
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'posts'>('portfolio');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{type: string, url: string} | null>(null);

  // Expanded social tabs states
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  // Portfolio States
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'video' | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [portfolioItemToDelete, setPortfolioItemToDelete] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = currentUser?.id === userId;

  // File Selection
  const handleFileSelect = (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be under 50MB");
      return;
    }
    
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast.error("Please upload an image (JPG, PNG, WebP) or video (MP4, MOV, WebM).");
      return;
    }
    
    if (isImage && file.size > 5 * 1024 * 1024) {
      toast.error("Images must be under 5MB");
      return;
    }
    
    setSelectedFile(file);
    const type = isImage ? 'image' : 'video';
    setSelectedFileType(type);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
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
    setSelectedFile(null);
    setSelectedFileType(null);
    setFilePreview(null);
  };

  // Add Portfolio Item
  const handleAddPortfolioItem = async () => {
    if (!selectedFile || !selectedFileType || !currentUser) return;
    
    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${selectedFileType} to portfolio...`);
    
    try {
      // 1. Upload to storage
      const publicUrl = await profilesService.uploadPortfolioMedia(currentUser.id, selectedFile, selectedFileType);
      
      // 2. Add to profile media
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
      
      // Reset form / modal
      setShowAddModal(false);
      clearSelectedFile();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload portfolio item", { id: toastId });
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
    setPortfolioItemToDelete(null); // Close modal
    
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
      toast.error(err.message || "Failed to delete item", { id: toastId });
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
      toast.error(err.message || "Failed to update featured item", { id: toastId });
    }
  };

  // Profile data fetch & Subscriptions
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: applications } = await supabase
            .from('applications')
            .select('gig_id')
            .eq('applicant_id', session.user.id);
          
          if (applications && isMounted) {
            setAppliedGigIds(new Set(applications.map(app => app.gig_id)));
          }
        }

        const [profileRes, statsData] = await Promise.all([
          profilesService.getProfile(userId),
          followsService.getFollowStats(userId)
        ]);

        if (profileRes.error) throw profileRes.error;
        
        if (isMounted) {
          setProfile(profileRes.data);
          setStats(statsData);
        }

        if (currentUser && !isOwnProfile) {
          const followStatus = await followsService.checkIfFollowing(currentUser.id, userId);
          if (isMounted) {
            setIsFollowing(followStatus.isFollowing);
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load profile');
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

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please sign in to follow users.");
      return;
    }
    if (!userId) return;

    // Optimistic UI Update
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);
    setStats(prev => ({
      ...prev,
      followers: newFollowingState ? prev.followers + 1 : Math.max(0, prev.followers - 1)
    }));

    const { error } = await followsService.toggleFollow(currentUser.id, userId, !newFollowingState);
    
    if (error) {
      setIsFollowing(!newFollowingState);
      setStats(prev => ({
        ...prev,
        followers: !newFollowingState ? prev.followers + 1 : Math.max(0, prev.followers - 1)
      }));
      toast.error("Failed to update follow status.");
    }
  };

  // Gather video files from portfolio + posts for the centralized TikTok visual stream
  const portfolioVideos = (profile?.portfolio_media || [])
    .filter((m: any) => m.type === 'video')
    .map((item: any) => ({
      id: item.id,
      url: item.url,
      type: 'video',
      title: 'Portfolio Reel Spotlight',
      isFromPost: false,
      likes_count: 12, // subtle default overlay values
      comments_count: 2
    }));

  const postVideos = posts
    .filter((p: any) => p.video_url)
    .map((post: any) => {
      let videoUrl = post.video_url;
      let thumbUrl = post.thumbnail_url;
      if (videoUrl && videoUrl.includes('thumb=')) {
        try {
          const match = videoUrl.match(/[?&]thumb=([^&]+)/);
          if (match) {
            thumbUrl = decodeURIComponent(match[1]);
            videoUrl = videoUrl.replace(match[0], '');
          }
        } catch (e) {}
      }
      return {
        id: post.id,
        url: videoUrl,
        thumbnailUrl: thumbUrl,
        type: 'video',
        title: post.text || 'GigsConnect Clip',
        isFromPost: true,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0
      };
    });

  const allVideos = [...portfolioVideos, ...postVideos];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] transition-colors">
        <Loader2 className="w-12 h-12 animate-spin text-brand-purple mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-650">Tuning Creative Feed...</p>
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

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#09090B] min-h-screen pt-16 sm:pt-20 pb-16 transition-colors duration-500 font-sans">
      
      {/* 1. TOP COVER ACTION ZONE */}
      <div id="profile-cover" className="h-52 sm:h-64 bg-gradient-to-br from-[#8B5CF6]/90 via-[#6D28D9]/95 to-[#4C1D95]/95 w-full relative overflow-hidden">
        {/* Animated backdrop decoration for luxury vibe */}
        <div className="absolute inset-x-0 bottom-0 top-1/4 bg-radial-gradient from-transparent to-black/20 pointer-events-none" />
        <div className="absolute top-10 left-10 w-44 h-44 rounded-full bg-brand-purple/20 blur-3xl" />
        <div className="absolute right-20 bottom-5 w-60 h-60 rounded-full bg-indigo-500/25 blur-3xl" />
        
        {/* Cover back button wrapper */}
        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-full flex items-start justify-between pt-6 relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-11 h-11 bg-black/20 backdrop-blur-md rounded-2xl text-white border border-white/10 hover:bg-black/40 active:scale-95 transition-all shadow-sm shadow-black/10 z-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Own badge indicator */}
          {isOwnProfile && (
            <span className="px-3 py-1 flex items-center gap-1.5 bg-white/20 backdrop-blur-md rounded-xl text-white text-[11px] font-black uppercase tracking-wider border border-white/15">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              Creator Room Live
            </span>
          )}
        </div>
      </div>

      {/* 2. PREMIUM INSTAGRAM/TIKTOK PROFILE ROW */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 relative -mt-16 sm:-mt-20 z-10">
        
        {/* Premium Profile Card */}
        <div id="profile-card" className="bg-white dark:bg-brand-dark-card rounded-[2.25rem] shadow-xl border border-gray-100 dark:border-[#1F1F23]/80 p-6 sm:p-10 mb-8 relative">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
            {/* Immersive Avatar block */}
            <div id="user-avatar" className="relative group/avatar">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-[2.25rem] border-4 border-white dark:border-brand-dark-card shadow-xl overflow-hidden bg-[#FAFAFA] dark:bg-[#0F0F12] flex-shrink-0 flex items-center justify-center relative transition-transform duration-300 group-hover/avatar:scale-[1.02]">
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
              
              {/* verification state inside visual wrap */}
              {profile.verification_status === 'verified' && (
                <div className="absolute -bottom-1 -right-1 z-20 bg-brand-purple text-white p-1.5 rounded-2xl border-4 border-white dark:border-brand-dark-card shadow">
                  <BadgeCheck className="w-5 h-5 text-white fill-current" />
                </div>
              )}
            </div>

            {/* Middle Identity Row */}
            <div className="text-center sm:text-left flex-1 min-w-0 w-full space-y-3.5">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 justify-center sm:justify-start">
                  <h1 className="text-2xl sm:text-3xl font-black text-brand-black dark:text-brand-white tracking-tight leading-tight truncate">
                    {profile.full_name || 'Anonymous Creator'}
                  </h1>
                  {profile.role && (
                    <span className="w-fit mx-auto sm:mx-0 px-2.5 py-0.5 rounded-lg bg-brand-purple/5 border border-brand-purple/10 text-brand-purple text-[10px] font-black uppercase tracking-wider">
                      {profile.role}
                    </span>
                  )}
                </div>
                {profile.username && (
                  <p className="text-gray-500 dark:text-gray-400 font-bold text-sm mt-0.5">@{profile.username}</p>
                )}
              </div>

              {/* Bio block */}
              {profile.bio ? (
                <p className="text-gray-600 dark:text-gray-300 text-[14px] leading-relaxed max-w-xl whitespace-pre-wrap font-medium">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-gray-400 dark:text-gray-600 text-xs italic font-medium">No bio provided by this talent.</p>
              )}

              {/* Badges / Skills tags array */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-2">
                  {profile.skills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1 bg-[#FAFAFA] dark:bg-[#161618] rounded-xl text-[11px] font-extrabold text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-[#1F1F23]">
                      #{skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Location indicator */}
              <div className="flex items-center justify-center sm:justify-start gap-1 text-gray-400 dark:text-gray-500 text-xs font-bold pt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.city ? `${profile.city}, ${profile.country}` : profile.country || 'Global Talent'}</span>
              </div>
            </div>
          </div>

          {/* Followers metrics counters */}
          <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-50 dark:border-[#1F1F23]/80 py-5 my-6">
            <div 
              className="flex flex-col items-center cursor-pointer group/stat border-r border-gray-50 dark:border-[#1F1F23]/80"
              onClick={() => setShowFollowersModal(true)}
            >
              <span className="text-2xl font-black text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors duration-200">
                {stats.followers >= 1000 ? (stats.followers / 1000).toFixed(1) + 'K' : stats.followers}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Followers
              </span>
            </div>
            
            <div 
              className="flex flex-col items-center cursor-pointer group/stat"
              onClick={() => setShowFollowingModal(true)}
            >
              <span className="text-2xl font-black text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors duration-200">
                {stats.following >= 1000 ? (stats.following / 1000).toFixed(1) + 'K' : stats.following}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Following
              </span>
            </div>
          </div>

          {/* Social Links Row of icons */}
          {(profile.facebook_url || profile.instagram_url || profile.tiktok_url || profile.twitter_url || profile.linkedin_url || profile.phone) && (
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-6 flex-wrap">
              {profile.instagram_url && (
                <a 
                  href={profile.instagram_url.startsWith('http') ? profile.instagram_url : `https://${profile.instagram_url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-[#161618] border border-gray-100 dark:border-[#1F1F23] hover:text-[#E1306C] text-gray-500 dark:text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile.tiktok_url && (
                <a 
                  href={profile.tiktok_url.startsWith('http') ? profile.tiktok_url : `https://${profile.tiktok_url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-[#161618] border border-gray-100 dark:border-[#1F1F23] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 transition-colors text-xs font-black uppercase tracking-tight"
                >
                  Tik
                </a>
              )}
              {profile.twitter_url && (
                <a 
                  href={profile.twitter_url.startsWith('http') ? profile.twitter_url : `https://${profile.twitter_url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-[#161618] border border-gray-100 dark:border-[#1F1F23] hover:text-[#1DA1F2] text-gray-500 dark:text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.facebook_url && (
                <a 
                  href={profile.facebook_url.startsWith('http') ? profile.facebook_url : `https://${profile.facebook_url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-[#161618] border border-gray-100 dark:border-[#1F1F23] hover:text-[#1877F2] text-gray-500 dark:text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {profile.linkedin_url && (
                <a 
                  href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-[#161618] border border-gray-100 dark:border-[#1F1F23] hover:text-[#0077B5] text-gray-500 dark:text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.phone && (
                <a 
                  href={`tel:${profile.phone}`} 
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-[#161618] border border-gray-100 dark:border-[#1F1F23] hover:text-brand-purple text-gray-500 dark:text-gray-400 hover:bg-gray-100 transition-colors"
                  title="Call Creator"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* Immersive Action Buttons */}
          <div className="flex flex-row gap-3.5 w-full">
            {isOwnProfile ? (
              <button 
                id="edit-btn"
                onClick={() => navigate('/edit-profile')} 
                className="w-full py-3.5 rounded-2xl font-extrabold text-sm bg-gray-100 dark:bg-[#18181B] border border-gray-150 dark:border-[#27272A] text-brand-black dark:text-brand-white hover:bg-gray-200 dark:hover:bg-[#27272A] active:scale-95 transition-all outline-none"
              >
                Edit Creator ProfileCard
              </button>
            ) : (
              <>
                <button 
                  id="follow-btn"
                  onClick={handleFollowToggle} 
                  className={`flex-1 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-md ${
                    isFollowing 
                      ? 'bg-gray-100 dark:bg-[#1F1F23] text-brand-black dark:text-brand-white hover:bg-gray-200 dark:hover:bg-[#2A2A2F] border border-gray-200 dark:border-[#2A2A2F] shadow-none' 
                      : 'bg-brand-purple hover:bg-[#8A4DFF] text-white shadow-[#6C2BD9]/20'
                  }`}
                >
                  {isFollowing ? (
                    <><UserCheck className="w-4.5 h-4.5" /> Following</>
                  ) : (
                    <><UserPlus className="w-4.5 h-4.5" /> Follow</>
                  )}
                </button>
                <button 
                  id="message-btn"
                  onClick={() => toast("Messaging starting shortly!")}
                  className="flex-1 py-3.5 rounded-2xl font-black text-sm bg-gray-100 dark:bg-[#1F1F23] border border-gray-200 dark:border-[#2A2A2F] text-brand-black dark:text-brand-white hover:bg-gray-200 dark:hover:bg-[#2A2A2F] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4.5 h-4.5" /> Message
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3. STICKY INTERACTIVE PROFILE TABS */}
        <div className="sticky top-[4.2rem] sm:top-[5rem] z-30 bg-[#FAFAFA]/90 dark:bg-[#09090B]/90 backdrop-blur-md py-4 border-b border-gray-100 dark:border-[#1F1F23] mb-6">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider relative transition-colors duration-300 ${
                activeTab === 'portfolio' 
                  ? 'text-brand-purple' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Portfolio
              {activeTab === 'portfolio' && (
                <motion.div 
                  layoutId="activeTabUnderline" 
                  className="absolute -bottom-4 left-0 right-0 h-[3px] bg-brand-purple rounded-full" 
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider relative transition-colors duration-300 ${
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

        {/* 4. TABBED CONTENT RENDER AREA */}
        <div className="min-h-[400px]">
          
          {/* TAB 1: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-wider flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-brand-purple" />
                  Portfolio Records
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
                /* Consistent 3-column layout maintaining square aspect ratio with zero layout shifts */
                <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
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
                  <Globe className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 font-bold text-sm">No portfolio items saved yet.</p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/15 font-bold rounded-xl transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add your first item
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: POSTS */}
          {activeTab === 'posts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-brand-black dark:text-brand-white uppercase tracking-wider flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-brand-purple" />
                Latest Updates
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
                  <Radio className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-3 animate-pulse" />
                  <p className="text-gray-600 dark:text-gray-400 font-bold text-sm">No updates posted on feed yet.</p>
                  {isOwnProfile && (
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple text-white hover:bg-brand-purple-hover font-bold rounded-xl transition-all"
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

      {/* 5. ADD PORTFOLIO WORK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9990] p-4">
          <div 
            className="w-full max-w-md bg-white dark:bg-brand-dark-card rounded-[2rem] shadow-2xl border border-gray-100 dark:border-[#2A2A2F] overflow-hidden animate-in fade-in zoom-in-95 duration-250"
          >
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
                  <Upload className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-3 animate-bounce" style={{ animationDuration: '2.5s' }} />
                  <p className="text-sm font-bold text-gray-750 dark:text-gray-200 mb-1">
                    Drag and drop your media, or <span className="text-brand-purple hover:underline">browse</span>
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 flex flex-col gap-0.5 leading-normal mt-2.5">
                    <span>Supports high-quality images and vertical/horizontal session logs</span>
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
                      <video src={filePreview || ''} className="w-full h-full object-contain" controls />
                    )}
                    
                    {!isUploading && (
                      <button
                        onClick={clearSelectedFile}
                        className="absolute top-2.5 right-2.5 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
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

      {/* 6. MODALS / LIGHTBOXES */}
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

      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
        >
          {/* Close lightbox helper */}
          <button 
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white border border-white/10 transition-colors cursor-pointer"
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
                src={selectedMedia.url}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      )}

      {/* 7. PORTFOLIO DELETION DIALOG */}
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
                Are you sure you want to remove this item from your public portfolio? This item and its uploaded asset will be removed permanently.
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

    </div>
  );
};

export default PublicProfile;
