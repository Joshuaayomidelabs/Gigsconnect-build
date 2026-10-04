import React, { useState, useEffect, useCallback } from 'react';
import { UserX, ShieldOff, Loader2, User } from 'lucide-react';
import { moderationService } from '../../services/moderationService';
import { supabase } from '../../services/supabaseClient';
import { toast } from 'sonner';

interface BlockedUserItem {
  id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
}

interface BlockedUsersSectionProps {
  userId: string;
}

export const BlockedUsersSection: React.FC<BlockedUsersSectionProps> = ({ userId }) => {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);

  const fetchBlockedUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: blockedIds, error } = await moderationService.getBlockedUsers(userId);
      if (error) throw error;

      if (!blockedIds || blockedIds.length === 0) {
        setBlockedUsers([]);
        return;
      }

      // Fetch only public presentation fields: id, full_name, username, avatar_url
      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .in('id', blockedIds);

      if (profError) throw profError;
      setBlockedUsers(profiles || []);
    } catch (err: any) {
      console.error('Failed to load blocked users:', err);
      toast.error('Could not load blocked users list.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers]);

  const handleUnblock = async (userToUnblock: BlockedUserItem) => {
    const displayName = userToUnblock.full_name || userToUnblock.username || 'this user';
    if (!window.confirm(`Are you sure you want to unblock ${displayName}?`)) {
      return;
    }

    try {
      setUnblockingId(userToUnblock.id);
      const { error } = await moderationService.unblockUser(userId, userToUnblock.id);
      if (error) throw error;

      setBlockedUsers(prev => prev.filter(u => u.id !== userToUnblock.id));
      toast.success(`${displayName} has been unblocked.`);
    } catch (err: any) {
      console.error('Failed to unblock user:', err);
      toast.error(err.message || 'Failed to unblock user.');
    } finally {
      setUnblockingId(null);
    }
  };

  return (
    <section id="blocked-users-section" className="bg-white dark:bg-brand-dark-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-[#27272A] shadow-xs">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0">
          <UserX className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-brand-black dark:text-brand-white">Blocked Users</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Users you block cannot message you or interact with your posts.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin text-brand-purple" />
        </div>
      ) : blockedUsers.length === 0 ? (
        <div className="text-center py-10 px-4 bg-gray-50/60 dark:bg-[#141418] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <ShieldOff className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-brand-black dark:text-brand-white mb-1">
            You haven't blocked anyone
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            When you block someone, they will appear here. You can unblock them at any time.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {blockedUsers.map((blocked) => (
            <div key={blocked.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700">
                  {blocked.avatar_url ? (
                    <img src={blocked.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-brand-black dark:text-brand-white truncate">
                    {blocked.full_name || 'Anonymous User'}
                  </div>
                  {blocked.username && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      @{blocked.username}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleUnblock(blocked)}
                disabled={unblockingId === blocked.id}
                className="px-4 py-1.5 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {unblockingId === blocked.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  'Unblock'
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
export default BlockedUsersSection;
