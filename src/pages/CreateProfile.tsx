import React from 'react';
import EditProfile from './EditProfile';

const CreateProfile: React.FC = () => {
  return (
    <div>
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Create Your Profile</h1>
        <p className="text-gray-500 text-lg">Let's get you set up to find your first gig.</p>
      </div>
      <EditProfile />
    </div>
  );
};

export default CreateProfile;
