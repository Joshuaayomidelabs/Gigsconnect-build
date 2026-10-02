import React from 'react';

interface AppSplashScreenProps {
  message?: string;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#6C3BFF] via-[#5B2DE0] to-[#4F23D6] text-white px-6 select-none overflow-hidden transition-colors">
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* White logo tile */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 p-4 mb-5 shadow-2xl flex items-center justify-center ring-4 ring-white/10 animate-pulse">
          <img 
            src="/assets/branding/logo.svg" 
            alt="GigsConnect" 
            className="w-full h-full object-contain rounded-2xl drop-shadow-md"
          />
        </div>

        {/* Wordmark */}
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Gigs<span className="text-purple-200">Connect</span>
        </h1>

        {/* Tagline */}
        <p className="text-xs sm:text-sm font-semibold text-purple-200/90 tracking-widest uppercase mt-2">
          Create, Collaborate, Earn
        </p>

        {/* Slim progress bar / pulse animation */}
        <div className="w-44 sm:w-52 h-1 bg-white/20 rounded-full overflow-hidden mt-8 relative">
          <div className="h-full bg-white rounded-full animate-pulse w-2/3 mx-auto" />
        </div>

        {message && (
          <p className="text-xs text-purple-200/70 mt-3 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AppSplashScreen;
