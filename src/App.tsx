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

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/browse" element={<BrowseGigs />} />
          <Route path="/gig/:id" element={<GigDetails />} />
          <Route path="/post" element={<PostGig />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/my-gigs" element={<MyPostedGigs />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
