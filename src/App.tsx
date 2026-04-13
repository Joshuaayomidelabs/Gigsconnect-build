import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import BrowseGigs from './pages/BrowseGigs';
import PostGig from './pages/PostGig';
import MyApplications from './pages/MyApplications';
import MyPostedGigs from './pages/MyPostedGigs';
import EditProfile from './pages/EditProfile';
import CreateProfile from './pages/CreateProfile';
import Notifications from './pages/Notifications';
import GigDetails from './pages/GigDetails';
import PublicProfile from './pages/PublicProfile';
import ApplicationDetails from './pages/ApplicationDetails';

import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { NotificationProvider } from './context/NotificationContext';

import { Toaster } from 'sonner';

const App: React.FC = () => {
  const { user, loading, error } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLandingPage = location.pathname === '/';
  const showBottomNav = user && !isAuthPage && !isLandingPage;

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
      <NotificationProvider>
        <div className="flex flex-col min-h-screen bg-brand-gray dark:bg-brand-black transition-colors">
          <Toaster position="top-right" richColors />
          <TopNav />
          <main className={`flex-grow ${showBottomNav ? 'pb-20 lg:pb-0' : ''}`}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected Routes */}
              <Route path="/overview" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/browse" element={<ProtectedRoute><BrowseGigs /></ProtectedRoute>} />
              <Route path="/gig/:id" element={<ProtectedRoute><GigDetails /></ProtectedRoute>} />
              <Route path="/post" element={<ProtectedRoute><PostGig /></ProtectedRoute>} />
              <Route path="/applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
              <Route path="/posted-gigs" element={<ProtectedRoute><MyPostedGigs /></ProtectedRoute>} />
              <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
              <Route path="/application/:id" element={<ProtectedRoute><ApplicationDetails /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          {showBottomNav && <BottomNav />}
          {!showBottomNav && <Footer />}
        </div>
      </NotificationProvider>
    </DarkModeProvider>
  );
};

export default App;
