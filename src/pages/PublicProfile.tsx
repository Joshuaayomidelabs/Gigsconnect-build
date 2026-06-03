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
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { profilesService } from '../services/profilesService';
import { followsService } from '../services/followsService';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import VerificationBadge from '../components/VerificationBadge';
import FollowListModal from '../components/FollowListModal';

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [appliedGigIds, setAppliedGigIds] = useState<Set<string>>(new Set());
  
  // Social Stats State
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio'>('portfolio');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{type: string, url: string} | null>(null);

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

  // File Preview Handler
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
    setPortfolioItemToDelete(null); // Close modal right away
    
    const toastId = toast.loading("Deleting item...");
    try {
      const itemToDelete = profile.portfolio_media.find((m: any) => m.id === itemId);
      if (!itemToDelete) throw new Error("Item not found");
      
      // Extract file path to delete from storage if it belongs to portfolio bucket
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

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch applied gig IDs
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
          if (isMounted) setProfile(payload.new);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId, currentUser, isOwnProfile]);

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
      // Revert on error
      setIsFollowing(!newFollowingState);
      setStats(prev => ({
        ...prev,
        followers: !newFollowingState ? prev.followers + 1 : Math.max(0, prev.followers - 1)
      }));
      toast.error("Failed to update follow status.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="pt-main pb-12 px-4 text-center min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
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
    <div className="bg-brand-gray dark:bg-brand-black min-h-screen pt-20 sm:pt-24 pb-12 transition-colors duration-500">
      {/* Top Banner Gradient */}
      <div className="h-40 bg-gradient-to-r from-[#6C2BD9]/80 to-[#4C1D95]/90 w-full relative">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 sm:left-8 flex items-center justify-center w-10 h-10 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative -mt-12 sm:-mt-16 z-10">
        {/* Profile Header Card */}
        <div className="bg-brand-white dark:bg-brand-dark-card rounded-[2rem] shadow-md border border-brand-gray dark:border-brand-black p-5 sm:p-8 mb-6 relative">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
            {/* Avatar */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-brand-white dark:border-brand-dark-card shadow-lg overflow-hidden bg-brand-gray dark:bg-brand-black flex-shrink-0 flex items-center justify-center relative -mt-14 sm:-mt-16 z-20 mx-auto sm:mx-0">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name} 
                  className="w-full h-full object-cover object-center" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <User className="w-12 h-12 text-gray-400 dark:text-gray-600" />
              )}
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0 w-full">
              <h1 className="text-2xl font-black text-brand-black dark:text-brand-white tracking-tight flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="truncate">{profile.full_name || 'Anonymous User'}</span>
                <VerificationBadge 
                  verificationStatus={profile.verification_status} 
                />
              </h1>
              {profile.username && (
                <p className="text-gray-500 dark:text-gray-400 font-medium truncate">@{profile.username}</p>
              )}
              
              <div className="flex items-center justify-center sm:justify-start gap-1 text-gray-500 dark:text-gray-400 text-sm font-medium mt-1 truncate">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{profile.city ? `${profile.city}, ${profile.country}` : profile.country || 'Global'}</span>
              </div>
            </div>
          </div>

          {/* Social Stats Row */}
          <div className="flex items-center justify-center sm:justify-start gap-8 sm:gap-10 py-5 border-t border-brand-gray dark:border-[#1F1F23] mb-6">
            <div className="flex flex-col items-center sm:items-start group cursor-pointer" onClick={() => setShowFollowersModal(true)}>
              <span className="text-xl font-black text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors">
                {stats.followers >= 1000 ? (stats.followers / 1000).toFixed(1) + 'K' : stats.followers}
              </span>
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 text-center sm:text-left">
                {stats.followers === 0 ? "No followers" : "Followers"}
              </span>
            </div>
            <div className="flex flex-col items-center sm:items-start group cursor-pointer" onClick={() => setShowFollowingModal(true)}>
              <span className="text-xl font-black text-brand-black dark:text-brand-white group-hover:text-brand-purple transition-colors">
                {stats.following >= 1000 ? (stats.following / 1000).toFixed(1) + 'K' : stats.following}
              </span>
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 text-center sm:text-left">
                {stats.following === 0 ? "None following" : "Following"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row sm:flex-row gap-3 justify-center sm:justify-start mb-6">
            {isOwnProfile ? (
              <button 
                onClick={() => navigate('/edit-profile')} 
                className="w-full sm:flex-1 sm:max-w-[200px] py-2.5 rounded-xl font-bold text-sm bg-gray-100 dark:bg-[#1F1F23] text-brand-black dark:text-brand-white hover:bg-gray-200 dark:hover:bg-[#2A2A2F] active:scale-95 transition-all"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  onClick={handleFollowToggle} 
                  className={`w-full sm:flex-1 sm:max-w-[160px] py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${
                    isFollowing 
                      ? 'bg-gray-100 dark:bg-[#1F1F23] text-brand-black dark:text-brand-white hover:bg-gray-200 dark:hover:bg-[#2A2A2F]' 
                      : 'bg-[#6C2BD9] hover:bg-[#8A4DFF] text-white shadow-md shadow-[#6C2BD9]/20'
                  }`}
                >
                  {isFollowing ? (
                    <><UserCheck className="w-4 h-4" /> Following</>
                  ) : (
                    <><UserPlus className="w-4 h-4" /> Follow</>
                  )}
                </button>
                <button 
                  onClick={() => toast("Messaging coming soon")}
                  className="w-full sm:flex-1 sm:max-w-[160px] py-2.5 rounded-xl font-bold text-sm bg-gray-100 dark:bg-[#1F1F23] text-brand-black dark:text-brand-white hover:bg-gray-200 dark:hover:bg-[#2A2A2F] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Message
                </button>
              </>
            )}
          </div>

          {/* Bio */}
          <div className="text-center sm:text-left w-full break-words">
            {profile.bio && (
              <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
            )}
            
            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                {profile.skills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1 bg-gray-50 dark:bg-[#161618] rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-[#1F1F23] max-w-full truncate">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Render */}
        <div className="mb-12 min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-brand-black dark:text-brand-white">Portfolio</h3>
            {isOwnProfile && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#6C2BD9] to-[#5B21B6] text-white text-sm font-bold rounded-xl shadow-md hover:from-[#7C3AED] hover:to-[#6D28D9] active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Work
              </button>
            )}
          </div>

          {profile.portfolio_media && profile.portfolio_media.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
              {profile.portfolio_media.map((item: any, index: number) => (
                <div 
                  key={item.id || index} 
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-brand-gray dark:bg-brand-black border-2 border-brand-gray dark:border-[#1F1F23]/80 group shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                    item.is_featured ? 'ring-4 ring-[#6C2BD9] ring-offset-2 dark:ring-offset-brand-black' : ''
                  }`}
                >
                  {/* Media Content */}
                  {item.type === 'video' ? (
                    <div className="w-full h-full relative cursor-pointer" onClick={() => setSelectedMedia({ type: "video", url: item.url })}>
                      <video 
                        src={item.url} 
                        className="w-full h-full object-cover" 
                        preload="metadata"
                      />
                      {/* Translucent Play Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/30 transition-all duration-200">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current text-white translate-x-[1px]" />
                        </div>
                      </div>
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Video
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full relative cursor-pointer group" onClick={() => setSelectedMedia({ type: "image", url: item.url })}>
                      <img 
                        src={item.url} 
                        alt={`Portfolio Work ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {/* Hover subtle zoom and dim */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200" />
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        Image
                      </span>
                    </div>
                  )}

                  {/* Owner Controls (Hover states on desktop, always shown cleanly) */}
                  {isOwnProfile && (
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {/* Toggle Featured Star */}
                      <button
                        onClick={(e) => handleToggleFeatured(e, item.id)}
                        className={`p-1.5 rounded-lg backdrop-blur-md shadow-md border active:scale-90 transition-all ${
                          item.is_featured 
                            ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600' 
                            : 'bg-black/60 text-gray-300 border-white/10 hover:bg-black/80 hover:text-white'
                        }`}
                        title={item.is_featured ? "Remove Featured" : "Mark as Featured"}
                      >
                        <Star className={`w-3.5 h-3.5 ${item.is_featured ? 'fill-current' : ''}`} />
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDeletePortfolioItem(e, item.id)}
                        className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 backdrop-blur-md shadow-md border border-white/10 active:scale-90 transition-all"
                        title="Delete past work"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Featured Badge if featured and not in hover state */}
                  {item.is_featured && (
                    <div className="absolute top-2.5 left-2.5 pointer-events-none px-2 py-1 bg-amber-500 text-white text-[9px] font-extrabold uppercase tracking-wider rounded-md shadow-sm group-hover:opacity-0 transition-opacity flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      Featured
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-brand-white dark:bg-brand-dark-card rounded-3xl p-12 text-center border border-brand-gray dark:border-[#1F1F23]">
              <Globe className="w-10 h-10 text-[#9CA3AF] dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-700 dark:text-gray-400 font-medium text-sm">No portfolio items saved.</p>
              {isOwnProfile && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C2BD9]/10 text-[#6C2BD9] dark:text-brand-purple hover:bg-[#6C2BD9]/15 font-bold rounded-xl transition-all animate-pulse"
                >
                  <Plus className="w-4 h-4" /> Add your first item
                </button>
              )}
            </div>
          )}
        </div>

        {/* ADD WORK MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9990] p-4">
            <div 
              className="w-full max-w-md bg-white dark:bg-brand-dark-card rounded-[2rem] shadow-2xl border border-gray-100 dark:border-[#2A2A2F] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 dark:border-[#1F1F23] flex items-center justify-between animate-none">
                <div>
                  <h3 className="text-lg font-black text-brand-black dark:text-brand-white">Add Past Work</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Showcase your talent and gigs</p>
                </div>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    clearSelectedFile();
                  }}
                  disabled={isUploading}
                  className="p-1 px-1.5 hover:bg-gray-100 dark:hover:bg-[#1F1F23]/60 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {!selectedFile ? (
                  /* Drag & Drop Zone */
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      dragActive 
                        ? 'border-[#6C2BD9] bg-[#6C2BD9]/5' 
                        : 'border-gray-200 dark:border-[#2A2A2F] hover:border-[#6C2BD9]/40 hover:bg-gray-50/50 dark:hover:bg-[#1A1A1E]/30'
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
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">
                      Drag and drop your media, or <span className="text-[#6C2BD9] dark:text-brand-purple hover:underline">browse</span>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 flex flex-col gap-0.5 leading-normal mt-2">
                      <span>Supports high-quality images and audio-visual recordings</span>
                      <span>JPEG, PNG, WebP up to 5MB</span>
                      <span>MP4, MOV, WebM up to 50MB</span>
                    </p>
                  </div>
                ) : (
                  /* File Selection Preview */
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5 dark:bg-black/30 border border-gray-200 dark:border-[#2A2A2F] flex items-center justify-center">
                      {selectedFileType === 'image' ? (
                        <img src={filePreview || ''} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                        <video src={filePreview || ''} className="w-full h-full object-contain" controls />
                      )}
                      
                      {!isUploading && (
                        <button
                          onClick={clearSelectedFile}
                          className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
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
              <div className="px-6 py-4 border-t border-gray-100 dark:border-[#1F1F23] flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-[#1A1A1E]/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    clearSelectedFile();
                  }}
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAddPortfolioItem}
                  disabled={!selectedFile || isUploading}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-[#6C2BD9] hover:bg-[#7C3AED] text-white disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 shadow-md hover:shadow-[#6C2BD9]/10 active:scale-95 transition-all"
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
        
      </div>
      
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
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          {selectedMedia.type === "image" && (
            <img
              src={selectedMedia.url}
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                objectFit: "contain",
              }}
            />
          )}

          {selectedMedia.type === "video" && (
            <video
              src={selectedMedia.url}
              controls
              autoPlay
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
              }}
            />
          )}
        </div>
      )}

      {/* CUSTOM PORTFOLIO DELETION CONFIRMATION DIALOG */}
      <AnimatePresence>
        {portfolioItemToDelete && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-brand-dark-card p-6 sm:p-8 rounded-[2rem] max-w-sm w-full shadow-2xl border border-gray-105 dark:border-[#2A2A2F] text-center"
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
                  className="flex-1 py-3.5 px-4 rounded-xl border border-gray-200 dark:border-brand-black text-brand-black dark:text-brand-white text-sm font-bold hover:bg-brand-gray dark:hover:bg-brand-black active:scale-95 transition-all cursor-pointer"
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
