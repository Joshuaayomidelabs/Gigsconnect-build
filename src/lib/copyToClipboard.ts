import { Clipboard } from '@capacitor/clipboard';
import { isNative } from './native';
import { toast } from 'sonner';

/**
 * Copies modern text formats to either mobile clipboard or web clipboard safely.
 * @param text The text to write to clipboard
 * @param successMessage Optional custom success notification message
 * @returns boolean indicating success or failure
 */
export const copyToClipboard = async (text: string, successMessage: string = 'Copied to clipboard!'): Promise<boolean> => {
  if (!text) {
    toast.error('Nothing to copy');
    return false;
  }

  try {
    if (isNative()) {
      await Clipboard.write({ string: text });
    } else {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback fallback for non-secure contexts or older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    }
    toast.success(successMessage);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    toast.error('Failed to copy to clipboard.');
    return false;
  }
};
