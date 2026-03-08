import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import BrowseGigs from './pages/BrowseGigs';
import PostGig from './pages/PostGig';
import MyApplications from './pages/MyApplications';
import MyPostedGigs from './pages/MyPostedGigs';
import EditProfile from './pages/EditProfile';
import SubscriptionPage from './pages/SubscriptionPage';
import GigDetails from './pages/GigDetails';

import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
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
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
