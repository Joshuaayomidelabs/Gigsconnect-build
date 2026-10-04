import React, { useState } from 'react';
import { User, Mail, KeyRound, ShieldAlert, CheckCircle, Info, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import PasswordInput from '../PasswordInput';
import { toast } from 'sonner';

interface AccountSectionProps {
  user: any;
}

export const AccountSection: React.FC<AccountSectionProps> = ({ user }) => {
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Email State
  const [newEmail, setNewEmail] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Provider check
  const provider = user?.app_metadata?.provider || 'email';
  const isSocialAuth = provider !== 'email';
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Current password is required.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      // 1. Re-authenticate first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: currentPassword,
      });

      if (signInError) {
        toast.error('Incorrect current password.');
        return;
      }

      // 2. Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast.error(updateError.message || 'Failed to update password.');
        return;
      }

      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Password update error:', err);
      toast.error(err.message || 'An error occurred while updating your password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = newEmail.trim();
    if (!trimmedEmail) {
      toast.error('Please enter a new email address.');
      return;
    }
    if (trimmedEmail.toLowerCase() === (user.email || '').toLowerCase()) {
      toast.error('New email must be different from your current email.');
      return;
    }

    try {
      setIsUpdatingEmail(true);
      const { error } = await supabase.auth.updateUser({
        email: trimmedEmail,
      });

      if (error) {
        toast.error(error.message || 'Failed to request email change.');
        return;
      }

      toast.success('Confirmation link sent! Please check your new email to verify the change.');
      setNewEmail('');
    } catch (err: any) {
      console.error('Email update error:', err);
      toast.error(err.message || 'An error occurred while requesting email change.');
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  return (
    <section id="account-section" className="bg-white dark:bg-brand-dark-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 dark:border-[#27272A] shadow-xs">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-brand-black dark:text-brand-white">Account Settings</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Manage your login email and security credentials.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Email Section */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-brand-purple" />
            Email Address
          </h3>

          <div className="bg-gray-50 dark:bg-[#141418] p-4 rounded-2xl border border-gray-100 dark:border-[#27272A] mb-4">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Current Email</div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
              <span className="text-sm font-bold text-brand-black dark:text-brand-white font-mono break-all min-w-0">
                {user.email || 'No email attached'}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 whitespace-nowrap self-start sm:self-auto">
                <CheckCircle className="w-3 h-3 shrink-0" /> Verified
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailChange} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Change Email Address
              </label>
              <input
                type="email"
                placeholder="Enter new email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full h-11 sm:h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#141418] text-sm text-brand-black dark:text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              We'll send a confirmation link to your new address. Your account email won't change until you click the link.
            </p>
            <button
              type="submit"
              disabled={isUpdatingEmail || !newEmail.trim()}
              className="px-5 py-2.5 bg-brand-black dark:bg-white text-white dark:text-brand-black font-bold text-xs rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
            >
              {isUpdatingEmail ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Sending Link...
                </>
              ) : (
                'Update Email'
              )}
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
            <KeyRound className="w-4 h-4 text-brand-purple" />
            Password & Security
          </h3>

          {isSocialAuth ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                  Social Login Active
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300/90 mt-0.5">
                  You signed in with {providerName}, so your password is managed by {providerName}.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <PasswordInput
                label="Current Password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PasswordInput
                  label="New Password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <PasswordInput
                  label="Confirm New Password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-start">
                <button
                  type="submit"
                  disabled={isUpdatingPassword || !currentPassword || !newPassword}
                  className="px-5 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-xs rounded-xl shadow-md shadow-brand-purple/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
export default AccountSection;
