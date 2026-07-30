import { toast } from 'sonner';

// Define friendly messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "We couldn't connect to the internet.\nPlease check your connection and try again.",
  UPLOAD_FAILED: "We couldn't upload your file.\nPlease check your internet connection and try again.",
  FILE_TOO_LARGE: "This file is too large.\nPlease upload a smaller image or video.",
  UNSUPPORTED_FILE: "This file type isn't supported.\nPlease upload a valid image or video.",
  AUTHENTICATION: "Your session has expired.\nPlease sign in again.",
  PERMISSION_DENIED: "You don't have permission to perform this action.",
  DATABASE_ERROR: "We couldn't save your changes.\nPlease try again.",
  RESOURCE_NOT_FOUND: "We couldn't find what you're looking for.",
  SERVER_ERROR: "Something went wrong on our end.\nPlease try again in a few moments.",
  REQUEST_TIMEOUT: "This request took longer than expected.\nPlease try again.",
  OFFLINE: "You're currently offline.\nReconnect to the internet and try again.",
  UNKNOWN_ERROR: "Something unexpected happened.\nPlease try again.",
};

export type ErrorType = 
  | 'NETWORK_ERROR'
  | 'UPLOAD_FAILED'
  | 'FILE_TOO_LARGE'
  | 'UNSUPPORTED_FILE'
  | 'AUTHENTICATION'
  | 'PERMISSION_DENIED'
  | 'DATABASE_ERROR'
  | 'RESOURCE_NOT_FOUND'
  | 'SERVER_ERROR'
  | 'REQUEST_TIMEOUT'
  | 'OFFLINE'
  | 'UNKNOWN_ERROR';

/**
 * Maps a technical error to a friendly user message
 */
export function getFriendlyErrorMessage(error: any): string {
  if (!error) return ERROR_MESSAGES.UNKNOWN_ERROR;

  const errorMessage = error?.message?.toLowerCase() || '';
  const errorCode = error?.code || error?.status || error?.statusCode;
  const errorName = error?.name?.toLowerCase() || '';

  // Network & Offline
  if (!navigator.onLine || errorMessage.includes('failed to fetch') || errorMessage.includes('networkerror') || errorName === 'networkerror') {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  if (errorName === 'aborterror' || errorMessage.includes('timeout')) {
    return ERROR_MESSAGES.REQUEST_TIMEOUT;
  }

  // Authentication
  if (errorCode === 401 || errorMessage.includes('jwt expired') || errorMessage.includes('session expired') || errorMessage.includes('unauthorized') || errorMessage.includes('invalid login credentials')) {
    return ERROR_MESSAGES.AUTHENTICATION;
  }

  // Permission
  if (errorCode === 403 || errorMessage.includes('forbidden') || errorMessage.includes('row-level security') || errorMessage.includes('rls')) {
    return ERROR_MESSAGES.PERMISSION_DENIED;
  }

  // Upload
  if (errorMessage.includes('tus failed') || errorMessage.includes('upload failed') || errorMessage.includes('storage') || errorMessage.includes('resumable upload failed')) {
    return ERROR_MESSAGES.UPLOAD_FAILED;
  }
  
  // File size / type
  if (errorCode === 413 || errorMessage.includes('payload too large') || errorMessage.includes('too large')) {
    return ERROR_MESSAGES.FILE_TOO_LARGE;
  }
  if (errorCode === 415 || errorMessage.includes('unsupported media type') || errorMessage.includes('unsupported file') || errorMessage.includes('mime type')) {
    return ERROR_MESSAGES.UNSUPPORTED_FILE;
  }

  // Not found
  if (errorCode === 404 || errorMessage.includes('not found')) {
    return ERROR_MESSAGES.RESOURCE_NOT_FOUND;
  }

  // Server Error
  if (errorCode === 500 || errorCode === 502 || errorCode === 503 || errorCode === 504 || errorMessage.includes('internal server error')) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }

  // Database (Supabase / Postgres)
  if (errorMessage.includes('postgreserror') || errorMessage.includes('sql') || errorCode === '23505' || errorMessage.includes('duplicate key') || errorMessage.includes('database')) {
    return ERROR_MESSAGES.DATABASE_ERROR;
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Handle and display an error
 * @param error The raw error object
 * @param context Optional context string for developer logging (e.g., "[Upload Error]")
 * @param onRetry Optional callback if the action can be retried
 */
export function handleError(error: any, context?: string, onRetry?: () => void) {
  // Developer logging
  if (context) {
    console.error(`[${context}]`, error);
  } else {
    console.error('[Application Error]', error);
  }

  const friendlyMessage = getFriendlyErrorMessage(error);

  // Authentication redirect logic can go here or in an axios/supabase interceptor
  // if (friendlyMessage === ERROR_MESSAGES.AUTHENTICATION) {
  //   window.location.href = '/login';
  // }

  if (onRetry) {
    toast.error(friendlyMessage, {
      action: {
        label: 'Retry',
        onClick: onRetry,
      },
      duration: 5000,
    });
  } else {
    toast.error(friendlyMessage, {
      duration: 5000,
    });
  }
}

// Notification helpers

export function notifySuccess(message: string = "Your changes have been saved successfully.") {
  toast.success(message);
}

export function notifyUploadSuccess(message: string = "Your file has been uploaded successfully.") {
  toast.success(message);
}

export function notifyInfo(message: string) {
  toast.info(message);
}

export function notifyWarning(message: string = "Your internet connection appears unstable.") {
  toast.warning(message);
}

export function notifyError(message: string) {
  toast.error(message);
}
