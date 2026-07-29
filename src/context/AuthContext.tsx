import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { profilesService } from '../services/profilesService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);
          if (initialSession?.user) {
            console.log('Auth Initialized - User ID:', initialSession.user.id);
          }
        }
      } catch (err: any) {
        if (mounted) {
          const errMsg = err.message || '';
          if (errMsg.includes('Failed to fetch') || errMsg.includes('fetch') || errMsg.includes('NetworkError')) {
            console.warn('Network or fetch error during auth initialization. Falling back to offline guest mode.', err);
            setUser(null);
            setSession(null);
          } else {
            console.error('Error fetching session:', err);
            setError(err.message || 'Failed to fetch session');
          }
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    initAuth();

    let subscription: any = null;
    try {
      const authChange = supabase.auth.onAuthStateChange((_event, currentSession) => {
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          if (currentSession?.user) {
            console.log('Auth State Changed - User ID:', currentSession.user.id);
          }
          setAuthLoading(false);
        }
      });
      subscription = authChange.data?.subscription;
    } catch (authErr: any) {
      console.warn('Failed to listen to auth state changes:', authErr);
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    try {
      setProfileLoading(true);
      const { data } = await profilesService.getProfile(user.id);
      
      if (data) {
        try {
          const { data: catData } = await supabase.from('profile_categories').select('category_id').eq('profile_id', user.id);
          data.categories_count = (catData && catData.length > 0) ? catData.length : (Array.isArray(data.categories) ? data.categories.length : 0);
        } catch {
          data.categories_count = Array.isArray(data.categories) ? data.categories.length : 0;
        }

        try {
          const { data: skillsData } = await supabase.from('profile_skills').select('skill_id').eq('profile_id', user.id);
          data.skills_count = (skillsData && skillsData.length > 0) ? skillsData.length : (Array.isArray(data.skills) ? data.skills.length : 0);
        } catch {
          data.skills_count = Array.isArray(data.skills) ? data.skills.length : 0;
        }
      }
      
      setProfile(data);
    } catch (err: any) {
      const errMsg = err.message || '';
      if (errMsg.includes('Failed to fetch') || errMsg.includes('fetch') || errMsg.includes('NetworkError')) {
        console.warn('Network or fetch error during profile fetch:', err);
      } else {
        console.error('Failed to fetch profile in AuthContext', err);
      }
    } finally {
      setProfileLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }

    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [fetchProfile, authLoading]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err: any) {
      console.error('Error signing out:', err);
    }
  };

  const loading = authLoading || (!!user && profileLoading && !profile);

  const value = {
    user,
    session,
    profile,
    loading,
    error,
    signOut,
    refreshProfile: fetchProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
