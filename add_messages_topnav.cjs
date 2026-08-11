const fs = require('fs');
let content = fs.readFileSync('src/components/TopNav.tsx', 'utf-8');

// Add MessageCircle import
if (!content.includes('MessageCircle')) {
  content = content.replace(
    'import { Plus } from "lucide-react";',
    'import { Plus, MessageCircle } from "lucide-react";'
  );
}

// Add Messages to desktop topnav
const oldNotifications = `<Link 
              to="/notifications" 
              className="relative p-2 text-brand-black dark:text-brand-white hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-full transition-colors"
            >
              <Bell className="w-6 h-6" />`;

const newNotifications = `<Link 
              to="/messages" 
              className="p-2 text-brand-black dark:text-brand-white hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-full transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </Link>
            <Link 
              to="/notifications" 
              className="relative p-2 text-brand-black dark:text-brand-white hover:bg-brand-gray dark:hover:bg-brand-dark-card rounded-full transition-colors"
            >
              <Bell className="w-6 h-6" />`;

if (content.includes(oldNotifications)) {
  content = content.replace(oldNotifications, newNotifications);
}

// Add Messages to mobile hamburger
const oldMobileMenu = `<li>
                <Link to="/overview" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
              </li>`;

const newMobileMenu = `<li>
                <Link to="/overview" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/messages" className="block px-4 py-2 text-brand-black dark:text-gray-200 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  Messages
                </Link>
              </li>`;

if (content.includes(oldMobileMenu)) {
  content = content.replace(oldMobileMenu, newMobileMenu);
}

fs.writeFileSync('src/components/TopNav.tsx', content, 'utf-8');
console.log('Added Messages to TopNav');
