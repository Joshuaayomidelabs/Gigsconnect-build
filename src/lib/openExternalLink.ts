import { Browser } from '@capacitor/browser';
import { isNative } from './native';

/**
 * Safely opens an external link using Capacitor's Browser plugin on native platforms
 * or window.open on desktop web.
 * 
 * @param url String URL of the link to open
 */
export const openExternalLink = async (url: string): Promise<void> => {
  if (!url) return;

  // Add https protocol if missing and is not an internal/relative path
  let targetUrl = url;
  if (!/^https?:\/\//i.test(url) && !url.startsWith('/') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
    targetUrl = `https://${url}`;
  }

  if (isNative()) {
    try {
      await Browser.open({ url: targetUrl });
    } catch (err) {
      console.error('Failed to open link with Capacitor Browser. Fallback to window.open', err);
      window.open(targetUrl, '_blank', 'noreferrer,noopener');
    }
  } else {
    window.open(targetUrl, '_blank', 'noreferrer,noopener');
  }
};
