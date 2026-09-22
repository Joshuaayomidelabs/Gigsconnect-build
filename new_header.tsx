        <div id="profile-card" className="bg-white dark:bg-brand-dark-card rounded-[2.25rem] shadow-xl border border-gray-100 dark:border-[#1F1F23]/80 p-6 sm:p-10 mb-8 relative">
          
          <div className="flex flex-col items-center text-center">
            {/* Avatar block with gradient ring & badge */}
            <div id="user-avatar" className="relative group/avatar mb-4">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-brand-dark-card shadow-xl overflow-hidden bg-[#FAFAFA] dark:bg-[#0F0F12] flex-shrink-0 flex items-center justify-center relative transition-transform duration-300 group-hover/avatar:scale-[1.02] ring-4 ring-brand-purple/20">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.full_name} 
                    className="w-full h-full object-cover object-center" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <User className="w-14 h-14 text-gray-300 dark:text-gray-700" />
                )}
              </div>
              
              {profile.verification_status === 'verified' && (
                <div className="absolute bottom-1 right-1 z-20 bg-brand-purple text-white p-1.5 rounded-full border-4 border-white dark:border-brand-dark-card shadow" title="Verified Creator">
                  <BadgeCheck className="w-5 h-5 text-white fill-current" />
                </div>
              )}
            </div>
            
            {/* Creator Identity Details */}
            <div className="w-full flex flex-col items-center justify-center">
              
              {/* Creator Name & Username */}
              <div className="mb-4">
                <h1 className="text-2xl sm:text-3xl font-black text-brand-black dark:text-brand-white tracking-tight leading-tight truncate">
                  {profile.full_name || 'Anonymous Creator'}
                </h1>
                {usernameHandle && (
                  <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-1">
                    {usernameHandle}
                  </p>
                )}
              </div>

              {/* Bio Summary */}
              {profile.bio && (
                <p className="mb-5 text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed italic max-w-2xl">
                  "{profile.bio}"
                </p>
              )}

              {/* Role & Availability Row */}
              <div className="mb-3 flex flex-wrap justify-center items-center gap-2">
                {(dynamicCategories.length > 0 || profile.role) && (
                  <>
                    {(dynamicCategories.length > 0 ? dynamicCategories : (profile.role ? [profile.role] : [])).slice(0, 1).map((cat: string) => (
                      <span key={cat} className="px-4 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-widest">
                        {cat}
                      </span>
                    ))}
                  </>
                )}
                
                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">Available for gigs</span>
                </div>
              </div>

              {/* Location */}
              <div className="mb-4 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-brand-purple shrink-0" />
                <span>{profile.city_town || profile.city ? `${profile.city_town || profile.city}, ${profile.country || ''}` : profile.country || 'Global Creator'}</span>
              </div>

              {/* Skills Chips */}
              {(dynamicSkills.length > 0 || (profile.skills && profile.skills.length > 0)) && (
                <div className="mb-6 flex flex-wrap justify-center gap-2 max-w-2xl">
                  {(dynamicSkills.length > 0 ? dynamicSkills : profile.skills).slice(0, 5).map((skill: string) => (
                    <span key={skill} className="px-3.5 py-1 bg-[#F9FAFB] dark:bg-[#161618] rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#27272A] shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Links Bar */}
              <div className="mb-6">
                {renderSocialLinks()}
              </div>

            </div>
          </div>

          {/* 3. AUTHENTIC STATS AREA */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 border-t border-b border-gray-100 dark:border-[#1F1F23]/80 py-5 mb-8">
            
            {/* Real Followers Count */}
            <div 
              className="flex flex-col items-center cursor-pointer group/stat p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              onClick={() => setShowFollowersModal(true)}
            >
              <span className="text-2xl font-black text-brand-black dark:text-brand-white group-hover/stat:text-brand-purple transition-colors">
                {stats.followers >= 1000 ? (stats.followers / 1000).toFixed(1) + 'K' : stats.followers}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-1">Followers</span>
            </div>
            
            {/* Real Following Count */}
            <div 
              className="flex flex-col items-center cursor-pointer group/stat p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              onClick={() => setShowFollowingModal(true)}
            >
              <span className="text-2xl font-black text-brand-black dark:text-brand-white group-hover/stat:text-brand-purple transition-colors">
                {stats.following >= 1000 ? (stats.following / 1000).toFixed(1) + 'K' : stats.following}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-1">Following</span>
            </div>

            {/* Real Portfolio Items Count */}
            <div className="flex flex-col items-center p-2">
              <span className="text-2xl font-black text-brand-black dark:text-brand-white">
                {profile.portfolio_media?.length || 0}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-1">Portfolio</span>
            </div>

            {/* Real Completed Gigs (ONLY shown if > 0) */}
            {completedGigsCount > 0 && (
              <div className="flex flex-col items-center p-2">
                <span className="text-2xl font-black text-brand-black dark:text-brand-white">{completedGigsCount}</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-1">Gigs</span>
              </div>
            )}
          </div>
          
          {/* 4. ACTION BUTTONS */}
          <div className="flex flex-row justify-center gap-3">
            {!isOwnProfile ? (
              <>
                <button 
                  onClick={handleFollowToggle}
                  disabled={isTogglingFollow}
                  className={`flex-1 max-w-[200px] h-12 flex items-center justify-center gap-2 rounded-full font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer ${
                    isFollowing
                      ? 'bg-gray-100 dark:bg-[#1F1F23] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#27272A] hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-200'
                      : 'bg-brand-purple text-white hover:bg-brand-purple-hover shadow-brand-purple/20'
                  }`}
                >
                  {isTogglingFollow ? (
                    <Loader2 className="w-4 h-4 animate-spin text-current" />
                  ) : isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={handleMessageClick}
                  disabled={isCreatingConversation}
                  className="w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#1F1F23] text-brand-black dark:text-white hover:bg-gray-200 dark:hover:bg-[#27272A] transition-all shadow-sm active:scale-95 cursor-pointer"
                  title="Message"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>

                <div className="relative shrink-0">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#1F1F23] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#27272A] transition-all cursor-pointer"
                    title="More options"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 top-14 w-48 bg-white dark:bg-[#1A1A1E] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#2A2A2F] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Profile URL copied to clipboard!");
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4 text-gray-400" />
                        Share Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowReportUserModal(true);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 flex items-center gap-2"
                      >
                        <Flag className="w-4 h-4" />
                        Report Profile
                      </button>
                      <button
                        onClick={async () => {
                          setShowProfileMenu(false);
                          if (window.confirm(`Are you sure you want to block ${profile.full_name || 'this creator'}?`)) {
                            await blockUser(profile.id, profile.full_name || 'Creator');
                          }
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Block Creator
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/edit-profile')}
                  className="flex-1 max-w-[200px] h-12 flex items-center justify-center gap-2 rounded-full bg-brand-purple text-white font-bold text-sm transition-all hover:bg-brand-purple-hover active:scale-95 shadow-md shadow-brand-purple/20 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('portfolio');
                    setShowAddModal(true);
                  }}
                  className="flex-1 max-w-[200px] h-12 flex items-center justify-center gap-2 rounded-full bg-gray-100 dark:bg-[#1F1F23] text-brand-black dark:text-white font-bold text-sm transition-all hover:bg-gray-200 dark:hover:bg-[#27272A] active:scale-95 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-brand-purple" />
                  Upload Work
                </button>
              </>
            )}
          </div>
        </div>
