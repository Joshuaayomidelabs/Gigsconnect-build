import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { Network } from '@capacitor/network';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import BrowseGigs from './pages/BrowseGigs';
import PostGig from './pages/PostGig';
import MyApplications from './pages/MyApplications';
import MyPostedGigs from './pages/MyPostedGigs';
import EditProfile from './pages/EditProfile';
import CreateProfile from './pages/CreateProfile';
import CreatorCategories from './pages/CreatorCategories';
import CreatorSkills from './pages/CreatorSkills';
import CreatorLocation from './pages/CreatorLocation';
import CreatorWelcome from './pages/CreatorWelcome';
import Notifications from './pages/Notifications';
import GigDetails from './pages/GigDetails';
import PublicProfile from './pages/PublicProfile';
import ApplicationDetails from './pages/ApplicationDetails';
import PostDetails from './pages/PostDetails';
import { FeaturedCreators } from './pages/FeaturedCreators';
import Settings from './pages/Settings';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Analytics from './pages/Analytics';

import ProtectedRoute from './components/ProtectedRoute';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CommunityGuidelines from './pages/CommunityGuidelines';
import CookiePolicy from './pages/CookiePolicy';
import CopyrightPolicy from './pages/CopyrightPolicy';
import AcceptableUsePolicy from './pages/AcceptableUsePolicy';
import ReportAbuse from './pages/ReportAbuse';
import HelpCenter from './pages/HelpCenter';
import SafetyCenter from './pages/SafetyCenter';
import FAQs from './pages/FAQs';
import Pricing from './pages/Pricing';
import AboutUs from './pages/AboutUs';
import SuccessStories from './pages/SuccessStories';
import CreatorsHub from './pages/CreatorsHub';

import { useAuth } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { NotificationProvider } from './context/NotificationContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { pushNotificationService } from './services/pushNotificationService';

import { Toaster, toast } from 'sonner';
import { notifyError } from './utils/errorHandler';

const App: React.FC = () => {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = 
    location.pathname === '/login' || 
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password';
  const isLandingPage = location.pathname === '/';
  const showBottomNav = user && !isAuthPage && !isLandingPage;

  // Deep link routing handler for native apps (Capacitor)
  useEffect(() => {
    let active = true;

    const setupDeepLinks = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const handler = await CapApp.addListener('appUrlOpen', (event: any) => {
            if (!active) return;
            console.log('App opened via deep link custom scheme URL:', event.url);

            const urlString = event.url;
            if (urlString.includes('reset-password')) {
              // Extract starting from the reset-password string to handle any query params or hash values
              const index = urlString.indexOf('reset-password');
              const routePart = urlString.substring(index); // gets e.g. "reset-password#access_token=...&refresh_token=..."
              console.log('Navigating native app to:', '/' + routePart);
              navigate('/' + routePart);
            }
          });

          return () => {
            active = false;
            handler.remove();
          };
        } catch (err) {
          console.error('Failed to configure mobile deep links listener:', err);
        }
      }
    };

    const cleanupPromise = setupDeepLinks();
    return () => {
      active = false;
      cleanupPromise.then(cleanup => cleanup?.());
    };
  }, [navigate]);

  useEffect(() => {
    let active = true;
    const setupBackButton = async () => {
      if (Capacitor.isNativePlatform()) {
        const handler = await CapApp.addListener('backButton', () => {
          if (!active) return;
          if (location.pathname === '/' || location.pathname === '/overview') {
            CapApp.minimizeApp();
          } else {
            window.history.back();
          }
        });
        return () => {
          active = false;
          handler.remove();
        };
      }
    };

    const cleanupPromise = setupBackButton();
    return () => {
      active = false;
      cleanupPromise.then(cleanup => cleanup?.());
    };
  }, [location.pathname]);

  // Network and App Resume/Pause Monitor for Native Containers
  useEffect(() => {
    let active = true;
    let networkListener: any = null;
    let appStateListener: any = null;

    const setupListeners = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Check initial network connection status
          const status = await Network.getStatus();
          if (!status.connected) {
            notifyError('You are offline. Connection is required to find gigs.');
          }

          // Monitor network connectivity changes
          networkListener = await Network.addListener('networkStatusChange', (status) => {
            if (!active) return;
            if (!status.connected) {
              notifyError('You are offline. Connection is required to find gigs.');
            } else {
              toast.dismiss('offline-toast');
              toast.success('Your connection has been restored!');
            }
          });

          // Handle background and resume app state
          appStateListener = await CapApp.addListener('appStateChange', ({ isActive }) => {
            if (!active) return;
            if (isActive) {
              console.log('App active from background. Syncing notifications.');
              window.dispatchEvent(new CustomEvent('profile-updated'));
            } else {
              console.log('App paused in background.');
            }
          });
        } catch (err) {
          console.error('Failed to initialize Capacitor native listeners:', err);
        }
      }
    };

    setupListeners();

    return () => {
      active = false;
      if (networkListener) networkListener.remove();
      if (appStateListener) appStateListener.remove();
    };
  }, []);

  // Initialize Native Push Notifications when a user log-in occurs
  useEffect(() => {
    if (user?.id) {
      pushNotificationService.initPushNotifications(navigate);
    }
  }, [user?.id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray dark:bg-brand-black transition-colors">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading GigsConnect...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray dark:bg-brand-black p-4 transition-colors">
        <div className="bg-brand-white dark:bg-brand-dark-card p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-red-100 dark:border-red-900/20">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-brand-black dark:text-brand-white mb-2">Connection Error</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-brand-purple text-brand-white font-bold rounded-xl hover:bg-brand-purple-hover transition-all shadow-lg shadow-purple-200 dark:shadow-none"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <DarkModeProvider>
      <SubscriptionProvider>
        <NotificationProvider>
        <div className="flex flex-col min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
          <Toaster position="top-right" richColors />
          <TopNav />
          <main className={`flex-grow ${showBottomNav ? 'pb-20 lg:pb-0' : ''}`}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/community-guidelines" element={<CommunityGuidelines />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/copyright-policy" element={<CopyrightPolicy />} />
        <Route path="/acceptable-use-policy" element={<AcceptableUsePolicy />} />
        <Route path="/report-abuse" element={<ReportAbuse />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/safety-center" element={<SafetyCenter />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/creators-hub" element={<CreatorsHub />} />
              {/* Protected Routes */}
              <Route path="/overview" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/featured-creators" element={<ProtectedRoute><FeaturedCreators /></ProtectedRoute>} />
              <Route path="/browse" element={<ProtectedRoute><BrowseGigs /></ProtectedRoute>} />
              <Route path="/gig/:id" element={<ProtectedRoute><GigDetails /></ProtectedRoute>} />
              <Route path="/post/:id" element={<ProtectedRoute><PostDetails /></ProtectedRoute>} />
              <Route path="/post" element={<ProtectedRoute><PostGig /></ProtectedRoute>} />
              <Route path="/applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
              <Route path="/applications/:id" element={<ProtectedRoute><ApplicationDetails /></ProtectedRoute>} />
              <Route path="/posted-gigs" element={<ProtectedRoute><MyPostedGigs /></ProtectedRoute>} />
              <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
              <Route path="/creator-categories" element={<ProtectedRoute><CreatorCategories /></ProtectedRoute>} />
              <Route path="/creator-skills" element={<ProtectedRoute><CreatorSkills /></ProtectedRoute>} />
              <Route path="/creator-location" element={<ProtectedRoute><CreatorLocation /></ProtectedRoute>} />
              <Route path="/creator-welcome" element={<ProtectedRoute><CreatorWelcome /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" />} />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          </Routes>
          </main>
          {showBottomNav && <BottomNav />}
          {!showBottomNav && <Footer />}
        </div>
      </NotificationProvider>
      </SubscriptionProvider>
    </DarkModeProvider>
  );
};

export default App;
