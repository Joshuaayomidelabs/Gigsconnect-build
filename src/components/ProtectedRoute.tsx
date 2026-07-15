import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray dark:bg-brand-black transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the current location they were trying to go to
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname,
          message: "You need an account to continue. Please log in or sign up to post or browse gigs."
        }} 
        replace 
      />
    );
  }

  // Redirect to create-profile if onboarding is strictly false (new users)
  // Existing users with null or true will not be redirected
  if (profile && profile.onboarding_completed === false && location.pathname !== '/create-profile') {
    return <Navigate to="/create-profile" replace />;
  }

  // Redirect to creator-categories if they completed the first step but haven't selected categories
  if (profile && profile.onboarding_completed === true && profile.categories_count === 0 && location.pathname !== '/creator-categories' && location.pathname !== '/create-profile') {
    return <Navigate to="/creator-categories" replace />;
  }

  // Redirect to creator-skills if they selected categories but haven't selected skills
  if (profile && profile.onboarding_completed === true && profile.categories_count > 0 && profile.skills_count === 0 && location.pathname !== '/creator-skills' && location.pathname !== '/creator-categories' && location.pathname !== '/create-profile') {
    return <Navigate to="/creator-skills" replace />;
  }

  // Redirect to creator-location if they selected skills but haven't provided location
  if (profile && profile.onboarding_completed === true && profile.categories_count > 0 && profile.skills_count > 0 && (!profile.country || !profile.city_town) && location.pathname !== '/creator-location' && location.pathname !== '/creator-skills' && location.pathname !== '/creator-categories' && location.pathname !== '/create-profile') {
    return <Navigate to="/creator-location" replace />;
  }

  // Redirect to creator-welcome if they finished location but haven't seen welcome
  if (profile && profile.onboarding_completed === true && profile.categories_count > 0 && profile.skills_count > 0 && profile.country && profile.city_town && profile.onboarding_progress !== 100 && location.pathname !== '/creator-welcome' && location.pathname !== '/creator-location' && location.pathname !== '/creator-skills' && location.pathname !== '/creator-categories' && location.pathname !== '/create-profile') {
    return <Navigate to="/creator-welcome" replace />;
  }

  // Redirect to overview if they are trying to access onboarding steps but have already completed them
  if (profile && profile.onboarding_completed === true && profile.categories_count > 0 && profile.skills_count > 0 && profile.country && profile.city_town && profile.onboarding_progress === 100 && (location.pathname === '/create-profile' || location.pathname === '/creator-categories' || location.pathname === '/creator-skills' || location.pathname === '/creator-location' || location.pathname === '/creator-welcome')) {
    return <Navigate to="/overview" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
