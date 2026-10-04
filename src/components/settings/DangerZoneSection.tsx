import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2, Loader2, X, AlertCircle } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { deleteMyAccount } from '../../services/accountService';
import { useSubscription } from '../../context/SubscriptionContext';
import { toast } from 'sonner';

interface DangerZoneSectionProps {
  userId: string;
}

export const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({ userId: _userId }) => {
  const navigate = useNavigate();
  const { subscription, plans } = useSubscription();
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Active plan detection
  const activePlanId = subscription?.plan_id || plans.find(p => p.name.toLowerCase() === 'starter')?.id;
  const activePlan = plans.find(p => p.id === activePlanId) || subscription?.plan;
  const planName = activePlan?.name || subscription?.plan_name || '';
  const isPaidPlan = planName.toLowerCase() === 'pro' || planName.toLowerCase() === 'premium';

  // Confirmation must match "DELETE" exactly
  const isConfirmed = deleteConfirmText === 'DELETE';

  const handleDeleteAccount = async () => {
    if (!isConfirmed || isDeleting) return;

    try {
      setIsDeleting(true);

      const result = await deleteMyAccount();
      if (!result.success) {
        // Keep modal open and show friendly error toast
        toast.error(result.error || 'Failed to delete account. Please try again.');
        setIsDeleting(false);
        return;
      }

      // Local sign-out (login no longer exists on server)
      await supabase.auth.signOut({ scope: 'local' });
      localStorage.removeItem('gigsconnect_fcm_token');
      window.dispatchEvent(new CustomEvent('profile-updated'));

      toast.success('Your account has been deleted.');
      setShowModal(false);
      navigate('/');
    } catch (err: any) {
      console.error('Account deletion error:', err);
      toast.error('An unexpected error occurred while deleting your account.');
      setIsDeleting(false);
    }
  };

  return (
    <section id="danger-zone-section" className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10 shadow-xs">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-red-100 dark:border-red-900/30">
        <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-red-900 dark:text-red-300">Danger Zone</h2>
          <p className="text-xs sm:text-sm text-red-700/80 dark:text-red-400/80">Irreversible actions that permanently erase your creator data.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#141418] border border-red-100 dark:border-red-950/40">
        <div className="max-w-xl">
          <h3 className="text-sm font-bold text-brand-black dark:text-brand-white">Delete GigsConnect Account</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            Permanently delete your profile, media portfolio, active gigs, and account records. This action cannot be undone.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/10 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-red-200 dark:border-red-900/50 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <button
                disabled={isDeleting}
                onClick={() => {
                  if (!isDeleting) {
                    setShowModal(false);
                    setDeleteConfirmText('');
                  }
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-black text-brand-black dark:text-brand-white mb-2">
              Are you absolutely sure?
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
              This action is <span className="text-red-600 font-bold">permanent and cannot be undone</span>. The following data will be permanently removed:
            </p>

            <ul className="list-disc pl-5 text-xs text-gray-600 dark:text-gray-400 space-y-1.5 mb-4 leading-normal font-medium">
              <li>Your profile</li>
              <li>Your posts, comments, and likes</li>
              <li>Gigs you posted and your applications</li>
              <li>Chats (they are also removed for the other person)</li>
              <li>All uploaded files and portfolio media</li>
              <li>Subscription records</li>
            </ul>

            {/* Highlighted warning for Pro or Premium users */}
            {isPaidPlan && (
              <div className="mb-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs font-bold leading-relaxed">
                  You have an active {planName} plan. Deleting your account ends it and there are no refunds.
                </p>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-xs font-bold text-brand-black dark:text-brand-white mb-2">
                To confirm, please type <span className="text-red-600 font-mono">DELETE</span> below:
              </label>
              <input
                type="text"
                placeholder="DELETE"
                value={deleteConfirmText}
                disabled={isDeleting}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#141418] text-sm text-center font-bold tracking-wider text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setShowModal(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Keep Account
              </button>
              <button
                type="button"
                disabled={!isConfirmed || isDeleting}
                onClick={handleDeleteAccount}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white text-xs font-bold shadow-md shadow-red-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:pointer-events-none"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Forever'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DangerZoneSection;
