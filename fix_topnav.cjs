const fs = require('fs');
let content = fs.readFileSync('src/components/TopNav.tsx', 'utf8');

const targetLinks = `              <li>
                <Link 
                  to="/edit-profile" 
                  className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Edit Profile
                </Link>
              </li>`;

const newLinks = `              <li>
                <Link 
                  to="/edit-profile" 
                  className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Edit Profile
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings" 
                  className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 dark:hover:bg-brand-purple/10 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Subscription Plans
                </Link>
              </li>`;

if (content.includes(targetLinks)) {
  content = content.replace(targetLinks, newLinks);
  fs.writeFileSync('src/components/TopNav.tsx', content);
  console.log("Updated TopNav.tsx");
} else {
  console.log("Could not find targetLinks");
}
