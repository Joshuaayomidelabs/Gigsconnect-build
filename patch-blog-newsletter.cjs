const fs = require('fs');

let content = fs.readFileSync('src/pages/Blog.tsx', 'utf-8');

const targetHandle = `  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };`;

const replacementHandle = `  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
    }
  };`;

if (content.includes(targetHandle)) {
  content = content.replace(targetHandle, replacementHandle);
}

const targetMessage = `Subscribed successfully!`;
const replacementMessage = `Newsletter signup is coming soon.`;

if (content.includes(targetMessage)) {
  content = content.replace(targetMessage, replacementMessage);
}

fs.writeFileSync('src/pages/Blog.tsx', content, 'utf-8');
console.log('Successfully patched Blog.tsx newsletter');
