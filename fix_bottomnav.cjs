const fs = require('fs');
let content = fs.readFileSync('src/components/BottomNav.tsx', 'utf-8');

// Replace navItems
const oldNavItemsRegex = /const navItems = \[[\s\S]*?\];/;
const newNavItems = `const navItems = [
    { icon: <Home />, label: 'Home', path: '/overview' },
    { icon: <Search />, label: 'Explore', path: '/browse' },
    { icon: <Briefcase />, label: 'Create', path: '/post', isAction: true },
    { 
      icon: <Bell />, 
      label: 'Notifications', 
      path: '/notifications',
      badge: unreadCount
    },
    { 
      icon: profile?.avatar_url ? (
        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <User />
      ), 
      label: 'Profile', 
      path: '/edit-profile',
      isProfile: true,
      matchPrefix: true // matches /edit-profile, /create-profile etc if needed, or we just use it for profile
    },
  ];`;
content = content.replace(oldNavItemsRegex, newNavItems);

fs.writeFileSync('src/components/BottomNav.tsx', content, 'utf-8');
console.log('Fixed BottomNav items');
