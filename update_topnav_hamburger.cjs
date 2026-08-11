const fs = require('fs');
let content = fs.readFileSync('src/components/TopNav.tsx', 'utf-8');

// Update the mobile toggle button condition
content = content.replace(
  /\{!\s*isLoggedIn\s*&&\s*!\s*isAuthPage\s*&&\s*\([\s\S]*?className="lg:hidden p-2/,
  `{!isLoggedIn && !isAuthPage && (
          <>
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-brand-black dark:text-brand-white hover:text-brand-purple transition-colors">Log in</Link>
              <Link to="/signup" className="px-6 py-2.5 rounded-full bg-brand-purple text-white text-sm font-bold hover:bg-brand-purple-dark hover:shadow-glow transition-all active:scale-95 whitespace-nowrap">
                Join for free
              </Link>
            </div>
          </>
        )}
        
        {!isAuthPage && (
          <button 
            className="lg:hidden p-2 text-brand-black dark:text-gray-400 hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-lg transition-colors"`
);

// We need to also remove the old toggle button from where it was
const oldToggleButton = `            {/* Mobile toggle for public pages */}
            <button 
              className="lg:hidden p-2 text-brand-black dark:text-gray-400 hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-lg transition-colors" 
              onClick={toggleMobile}
              aria-label="Toggle menu"
            >
              <span className="text-2xl">☰</span>
            </button>
          </>
        )}`;
content = content.replace(oldToggleButton, `          </>
        )}`);

// Update the mobile menu itself
const oldMobileMenu = `{/* Mobile menu (Only for public pages since authenticated users have BottomNav) */}
      {mobileOpen && !isLoggedIn && (`
const newMobileMenu = `{/* Mobile menu */}
      {mobileOpen && (`
content = content.replace(oldMobileMenu, newMobileMenu);

const mobileMenuLinks = `          <li>
            <Link 
              to="/browse" 
              className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Find Gigs
            </Link>
          </li>
          <li>
            <Link 
              to="/browse" 
              className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Find Talent
            </Link>
          </li>
          <li>
            <a 
              href="/#how-it-works" 
              className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              How it works
            </a>
          </li>
          <div className="h-px bg-brand-gray dark:bg-brand-dark-card my-2" />
          <li>
            <Link 
              to="/login" 
              className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
          </li>
          <li>
            <Link 
              to="/signup" 
              className="block px-4 py-2 text-brand-purple font-bold hover:bg-brand-purple/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Join for free
            </Link>
          </li>`;

const newMobileMenuLinks = `{isLoggedIn ? (
            <>
              <li>
                <Link to="/overview" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/applications" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  My Applications
                </Link>
              </li>
              <li>
                <Link to="/posted-gigs" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  My Posted Gigs
                </Link>
              </li>
              <div className="h-px bg-brand-gray dark:bg-brand-dark-card my-2" />
              <li>
                <Link to="/edit-profile" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  Settings
                </Link>
              </li>
              <div className="h-px bg-brand-gray dark:bg-brand-dark-card my-2" />
              <li>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left block px-4 py-2 text-red-500 font-bold hover:bg-brand-purple/5 rounded-lg transition-colors">
                  Log out
                </button>
              </li>
            </>
          ) : (
            <>
${mobileMenuLinks}
            </>
          )}`;

content = content.replace(mobileMenuLinks, newMobileMenuLinks);

fs.writeFileSync('src/components/TopNav.tsx', content, 'utf-8');
console.log('Fixed TopNav hamburger');
