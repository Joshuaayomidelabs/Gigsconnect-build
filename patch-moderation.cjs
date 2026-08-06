const fs = require('fs');
const content = `import { useState, useEffect, useCallback } from 'react';
import { moderationService } from '../services/moderationService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { handleError, notifyError } from '../utils/errorHandler';

/**
 * Custom hook to manage Apple UGC Compliance (Guideline 1.2) - reporting content and blocking users.
 */
export const useModeration = () => {
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = user?.id || null;

  const fetchBlocks = useCallback(async (userId: string) => {
    const { data, error } = await moderationService.getBlockedUsers(userId);
    if (!error && data) {
      setBlockedUsers(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchBlocks(currentUserId);
    } else {
      setBlockedUsers([]);
      setLoading(false);
    }
  }, [currentUserId, fetchBlocks]);

  useEffect(() => {
    const handleBlockedChanged = () => {
      if (currentUserId) fetchBlocks(currentUserId);
    };
    window.addEventListener('user-blocked-changed', handleBlockedChanged);
    return () => window.removeEventListener('user-blocked-changed', handleBlockedChanged);
  }, [currentUserId, fetchBlocks]);

  /**
   * Blocks a specific target user.
   */
  const blockUser = async (targetUserId: string, targetName: string): Promise<boolean> => {
    if (!currentUserId) {
      notifyError('Please log in to block users.');
      return false;
    }

    if (currentUserId === targetUserId) {
      notifyError('You cannot block yourself.');
      return false;
    }

    const toastId = toast.loading(\`Blocking \${targetName}...\`);
    const { error, alreadyBlocked } = await moderationService.blockUser(currentUserId, targetUserId);
    
    if (error) {
      handleError(error, "Operation Error");
      return false;
    }

    if (alreadyBlocked) {
      toast.info(\`You have already blocked \${targetName}.\`, { id: toastId });
    } else {
      toast.success(\`Blocked \${targetName}. Their posts, comments, and profile content are now filtered.\`, { id: toastId });
    }
    
    return true;
  };

  /**
   * Unblocks a specific user.
   */
  const unblockUser = async (targetUserId: string, targetName: string): Promise<boolean> => {
    if (!currentUserId) return false;
    
    const toastId = toast.loading(\`Unblocking \${targetName}...\`);
    const { error } = await moderationService.unblockUser(currentUserId, targetUserId);
    
    if (error) {
      handleError(error, "Operation Error");
      return false;
    }

    toast.success(\`Unblocked \${targetName}.\`, { id: toastId });
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
      notifyError('Please log in first to submit a report.');
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
      handleError(error, "Operation Error");
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
`;

fs.writeFileSync('src/hooks/useModeration.ts', content, 'utf-8');
console.log('Rewritten useModeration.ts');
