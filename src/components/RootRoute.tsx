import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useAuth } from '../context/AuthContext';
import { hasReturningUserFlag } from '../utils/returningUser';

interface RootRouteProps {
  children: React.ReactNode;
}

export const RootRoute: React.FC<RootRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  // 1. Hash present (e.g., /#pricing-section) -> always render Landing page children
  if (location.hash) {
    return <>{children}</>;
  }

  // 2. Logged-in user -> redirect to /overview (replace)
  if (user) {
    return <Navigate to="/overview" replace />;
  }

  // 3. Native platform or returning user flag -> redirect to /login (replace)
  if (Capacitor.isNativePlatform() || hasReturningUserFlag()) {
    return <Navigate to="/login" replace />;
  }

  // 4. Otherwise, brand new visitor on the web -> render Landing page
  return <>{children}</>;
};

export default RootRoute;
