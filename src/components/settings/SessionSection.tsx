import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldAlert, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export const SessionSection: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const performLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast.success('Signed out successfully.');
      navigate('/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      toast.error('Failed to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
      setShowConfirmModal(false);
    }
  };

  const handleLogoutClick = () => {
    // If on mobile screen width or touch, show confirmation modal
    if (window.innerWidth < 640) {
      setShowConfirmModal(true);
    } else {
      performLogout();
    }
  };

  return (
    <section id="session-section" className="bg-white dark:bg-brand-dark-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-[#27272A] shadow-xs">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0">
          <LogOut className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-brand-black dark:text-brand-white">Session Management</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Sign out of your active browser session on this device.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] dark:bg-[#141418] border border-gray-150 dark:border-gray-800">
        <div>
          <h3 className="text-sm font-bold text-brand-black dark:text-brand-white">Active Device Session</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            You are currently authenticated. Signing out will clear your session keys locally.
          </p>
        </div>

        <button
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-bold active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing out...
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4 text-brand-purple" />
              Sign Out
            </>
          )}
        </button>
      </div>

      {/* Mobile Logout Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-150 dark:border-gray-800 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-brand-black dark:text-brand-white mb-1.5">
              Confirm Sign Out
            </h3>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Are you sure you want to log out of GigsConnect? You will need to sign in again to access your messages and portfolio.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={performLogout}
                disabled={isLoggingOut}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-xs font-bold text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default SessionSection;
