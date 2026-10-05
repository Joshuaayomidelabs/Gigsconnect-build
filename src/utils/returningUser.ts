const RETURNING_USER_KEY = 'gc_returning_user';

export const hasReturningUserFlag = (): boolean => {
  try {
    return localStorage.getItem(RETURNING_USER_KEY) === '1';
  } catch {
    return false;
  }
};

export const markReturningUser = (): void => {
  try {
    localStorage.setItem(RETURNING_USER_KEY, '1');
  } catch {
    // Ignore storage errors (e.g. private browsing or restricted quota)
  }
};

export const clearReturningUser = (): void => {
  try {
    localStorage.removeItem(RETURNING_USER_KEY);
  } catch {
    // Ignore storage errors
  }
};
