const fs = require('fs');
let content = fs.readFileSync('src/components/TopNav.tsx', 'utf-8');

// Fix the typo on line 100
content = content.replace(
  /className="lg:hidden p-2 text-brand-black dark:text-gray-400 hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-lg transition-colors" text-brand-black dark:text-gray-400 hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-lg transition-colors"/,
  'className="lg:hidden p-2 text-brand-black dark:text-gray-400 hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-lg transition-colors"'
);

// We need to fix the JSX structure around the mobile toggle.
// Let's replace the whole section to be sure.
const oldSectionRegex = /\{!isLoggedIn && !isAuthPage && \([\s\S]*?\{isLoggedIn && \(/;
const newSection = `{!isLoggedIn && !isAuthPage && (
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-brand-black dark:text-brand-white hover:text-brand-purple transition-colors">Log in</Link>
            <Link to="/signup" className="px-6 py-2.5 rounded-full bg-brand-purple text-white text-sm font-bold hover:bg-brand-purple-dark hover:shadow-glow transition-all active:scale-95 whitespace-nowrap">
              Join for free
            </Link>
          </div>
        )}

        {!isAuthPage && (
          <button 
            className="lg:hidden p-2 text-brand-black dark:text-gray-400 hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-lg transition-colors" 
            onClick={toggleMobile}
            aria-label="Toggle menu"
          >
            <span className="text-2xl">☰</span>
          </button>
        )}

        {isLoggedIn && (`

content = content.replace(oldSectionRegex, newSection);

fs.writeFileSync('src/components/TopNav.tsx', content, 'utf-8');
console.log('Fixed TopNav syntax');
