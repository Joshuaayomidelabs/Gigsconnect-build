import { supabase } from './supabaseClient';

export interface DeleteAccountResponse {
  success: boolean;
  error?: string;
}

export const accountService = {
  /**
   * Invokes the 'delete-account' edge function to permanently delete the logged-in user's
   * data, uploaded files, and authentication account.
   */
  async deleteMyAccount(): Promise<DeleteAccountResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: { confirm: 'DELETE' }
      });

      if (error) {
        console.error('Edge function error invoking delete-account:', error);
        const friendlyMessage = error.message && !error.message.includes('{')
          ? error.message
          : 'Unable to delete your account at this time. Please try again or contact support.';
        return { success: false, error: friendlyMessage };
      }

      if (data && data.error) {
        console.error('delete-account reported error:', data.error);
        // Do not show the raw "detail" to users
        const friendlyMessage = typeof data.error === 'string'
          ? data.error
          : 'Unable to delete your account at this time. Please try again or contact support.';
        return { success: false, error: friendlyMessage };
      }

      if (data && data.success) {
        return { success: true };
      }

      // If no explicit error was returned and operation completed
      return { success: true };
    } catch (err: any) {
      console.error('Unexpected error in deleteMyAccount:', err);
      return {
        success: false,
        error: 'A connection issue occurred while deleting your account. Please try again.'
      };
    }
  }
};

export const deleteMyAccount = accountService.deleteMyAccount;
export default accountService;
