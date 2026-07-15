import { useState, useEffect, useCallback } from 'react';
import { moderationService } from '../services/moderationService';
import { supabase } from '../services/supabaseClient';
import { toast } from 'sonner';

/**
 * Custom hook to manage Apple UGC Compliance (Guideline 1.2) - reporting content and blocking users.
 */
export const useModeration = () => {
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchBlocks = useCallback(async (userId: string) => {
    const { data, error } = await moderationService.getBlockedUsers(userId);
    if (!error && data) {
      setBlockedUsers(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && active) {
        setCurrentUserId(session.user.id);
        fetchBlocks(session.user.id);
      } else {
        setLoading(false);
      }
    };

    init();

    // Listen to changes in auth state so we update properly if user logs in/out
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user && active) {
          setCurrentUserId(session.user.id);
          fetchBlocks(session.user.id);
        } else if (!session && active) {
          setCurrentUserId(null);
          setBlockedUsers([]);
          setLoading(false);
        }
      }
    );

    const handleBlockedChanged = () => {
      const uId = supabase.auth.getUser(); // Safe check
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user && active) {
          fetchBlocks(session.user.id);
        }
      });
    };

    window.addEventListener('user-blocked-changed', handleBlockedChanged);

    return () => {
      active = false;
      subscription.unsubscribe();
      window.removeEventListener('user-blocked-changed', handleBlockedChanged);
    };
  }, [fetchBlocks]);

  /**
   * Blocks a specific target user.
   */
  const blockUser = async (targetUserId: string, targetName: string): Promise<boolean> => {
    if (!currentUserId) {
      toast.error('Please log in to block users.');
      return false;
    }

    if (currentUserId === targetUserId) {
      toast.error('You cannot block yourself.');
      return false;
    }

    const toastId = toast.loading(`Blocking ${targetName}...`);
    const { error, alreadyBlocked } = await moderationService.blockUser(currentUserId, targetUserId);
    
    if (error) {
      toast.error(error.message || 'Failed to block user.', { id: toastId });
      return false;
    }

    if (alreadyBlocked) {
      toast.info(`You have already blocked ${targetName}.`, { id: toastId });
    } else {
      toast.success(`Blocked ${targetName}. Their posts, comments, and profile content are now filtered.`, { id: toastId });
    }
    
    return true;
  };

  /**
   * Unblocks a specific user.
   */
  const unblockUser = async (targetUserId: string, targetName: string): Promise<boolean> => {
    if (!currentUserId) return false;

    const toastId = toast.loading(`Unblocking ${targetName}...`);
    const { error } = await moderationService.unblockUser(currentUserId, targetUserId);

    if (error) {
      toast.error(error.message || 'Failed to unblock user.', { id: toastId });
      return false;
    }

    toast.success(`Unblocked ${targetName}.`, { id: toastId });
    return true;
  };

  /**
   * Reports an item of objectionable content.
   */
  const reportContent = async (
    contentType: 'post' | 'profile' | 'comment' | 'gig',
    contentId: string,
    reason: string,
    details?: string
  ): Promise<boolean> => {
    if (!currentUserId) {
      toast.error('Please log in first to submit a report.');
      return false;
    }

    const toastId = toast.loading('Submitting report...');
    const { error, alreadyReported } = await moderationService.reportContent({
      reporter_id: currentUserId,
      content_type: contentType,
      content_id: contentId,
      reason,
      details: details || ''
    });

    if (error) {
      toast.error(error.message || 'Failed to submit report. Please try again.', { id: toastId });
      return false;
    }

    if (alreadyReported) {
      toast.success('You have already reported this content for moderation. It is under investigation.', { id: toastId });
    } else {
      toast.success('Report submitted. GigsConnect moderation has queued this content for immediate review.', { id: toastId });
    }

    return true;
  };

  const isUserBlocked = useCallback((userId: string): boolean => {
    return blockedUsers.includes(userId);
  }, [blockedUsers]);

  return {
    blockedUsers,
    isUserBlocked,
    blockUser,
    unblockUser,
    reportContent,
    loadingModeration: loading,
    currentUserId
  };
};
