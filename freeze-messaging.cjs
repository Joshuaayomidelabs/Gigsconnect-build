const fs = require('fs');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  for (const { search, replace } of replacements) {
    if (typeof search === 'string') {
      if (content.includes(search)) {
        content = content.replace(search, replace);
        modified = true;
      }
    } else if (search instanceof RegExp) {
      if (search.test(content)) {
        content = content.replace(search, replace);
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`No changes made to ${filePath}`);
  }
}

// 1. BottomNav.tsx
replaceInFile('src/components/BottomNav.tsx', [
  {
    search: /{ icon: <MessageCircle \/>, label: 'Messages', path: '\/messages' },/,
    replace: `{ icon: <MessageCircle />, label: 'Messages', path: '/messages', isFrozen: true },`
  },
  {
    search: `import { NavLink, useLocation, useNavigate } from 'react-router-dom';`,
    replace: `import { NavLink, useLocation, useNavigate } from 'react-router-dom';\nimport { toast } from 'sonner';`
  },
  {
    search: /return \(\s*<NavLink\s*key={item\.path}\s*to={item\.path}/,
    replace: `if (item.isFrozen) {
              return (
                <button
                  key={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    toast('Messaging is coming soon.', {
                      description: "We're working on bringing messaging to GigsConnect."
                    });
                  }}
                  className="flex flex-col items-center justify-center gap-1 group relative flex-1"
                >
                  <div className={\`p-2.5 rounded-2xl transition-all duration-300 overflow-hidden \${
                    isActive 
                      ? 'text-brand-purple bg-brand-purple/5 dark:bg-brand-purple/10' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-brand-purple group-hover:bg-brand-purple/5 dark:group-hover:bg-brand-purple/10'
                  }\`}>
                    {React.cloneElement(item.icon as React.ReactElement, { 
                      className: \`w-5 h-5 transition-all duration-300 \${isActive ? 'scale-110 stroke-[2.5px]' : 'group-active:scale-90'}\` 
                    })}
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-purple shadow-[0_0_8px_rgba(75,0,130,0.5)]"
                    />
                  )}
                </button>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}`
  }
]);

// 2. PublicProfile.tsx
replaceInFile('src/pages/PublicProfile.tsx', [
  {
    search: /const handleMessageClick = async \(\) => {[\s\S]*?setIsCreatingConversation\(false\);\n    }\n  };/,
    replace: `const handleMessageClick = async () => {
    toast('Messaging is coming soon.', {
      description: "We're working on bringing messaging to GigsConnect."
    });
  };`
  }
]);

// 3. NotificationDropdown.tsx
replaceInFile('src/components/NotificationDropdown.tsx', [
  {
    search: /<Link\s*to="\/messages"\s*onClick=\{\(\) => \{\s*handleMarkAsRead\(notif\.id\);\s*setIsOpen\(false\);\s*\}\}\s*className="text-\[10px\] font-bold text-brand-purple border border-brand-purple px-3 py-1\.5 rounded-lg hover:bg-brand-purple-soft transition-all"\s*>\s*Message Applicant\s*<\/Link>/,
    replace: `<button 
                            onClick={() => {
                              handleMarkAsRead(notif.id);
                              setIsOpen(false);
                              toast('Messaging is coming soon.', {
                                description: "We're working on bringing messaging to GigsConnect."
                              });
                            }}
                            className="text-[10px] font-bold text-brand-purple border border-brand-purple px-3 py-1.5 rounded-lg hover:bg-brand-purple-soft transition-all"
                          >
                            Message Applicant
                          </button>`
  }
]);

// 4. ConversationCard.tsx
replaceInFile('src/components/messages/ConversationCard.tsx', [
  {
    search: `import { useNavigate } from 'react-router-dom';`,
    replace: `import { useNavigate } from 'react-router-dom';\nimport { toast } from 'sonner';`
  },
  {
    search: /onClick=\{\(\) => navigate\(\`\/messages\/\$\{conversation\.conversation_id\}\`\)\}/,
    replace: `onClick={() => toast('Messaging is coming soon.', { description: "We're working on bringing messaging to GigsConnect." })}`
  }
]);

// 5. pushNotificationService.ts
replaceInFile('src/services/pushNotificationService.ts', [
  {
    search: `import { toast } from 'sonner';`,
    replace: `import { toast } from 'sonner';`
  },
  {
    search: /if \(type === 'message'\) \{\s*navigate\('\/messages'\);\s*\}/,
    replace: `if (type === 'message') {
              toast('Messaging is coming soon.', { description: "We're working on bringing messaging to GigsConnect." });
            }`
  }
]);

