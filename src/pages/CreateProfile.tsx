import React from 'react';
import EditProfile from './EditProfile';

const CreateProfile: React.FC = () => {
  return (
    <div className="bg-brand-gray min-h-screen">
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-brand-black tracking-tight mb-2">Create Your <span className="text-brand-purple">Profile</span></h1>
        <p className="text-brand-gray-dark text-lg">Let's get you set up to find your first gig.</p>
      </div>
      <EditProfile />
    </div>
  );
};

export default CreateProfile;
