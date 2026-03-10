import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
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
import SubscriptionPage from './pages/SubscriptionPage';
import GigDetails from './pages/GigDetails';

import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLandingPage = location.pathname === '/';
  const showBottomNav = user && !isAuthPage && !isLandingPage;

  return (
    <div className="flex flex-col min-h-screen bg-brand-gray">
      <Header />
      <main className={`flex-grow ${showBottomNav ? 'pb-20 lg:pb-0' : ''}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/browse" element={<ProtectedRoute><BrowseGigs /></ProtectedRoute>} />
          <Route path="/gig/:id" element={<ProtectedRoute><GigDetails /></ProtectedRoute>} />
          <Route path="/post" element={<ProtectedRoute><PostGig /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
          <Route path="/my-gigs" element={<ProtectedRoute><MyPostedGigs /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {showBottomNav && <BottomNav />}
      {!showBottomNav && <Footer />}
    </div>
  );
};

export default App;
