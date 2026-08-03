const fs = require('fs');
let content = fs.readFileSync('src/pages/PublicProfile.tsx', 'utf-8');

const oldHandler = `  const handleMessageClick = async () => {
    if (!user) {
      toast.error('Please sign in to send messages');
      navigate('/login');
      return;
    }
    
    if (user.id === profile?.id) {
      toast.error('You cannot message yourself');
      return;
    }`;

const newHandler = `  const handleMessageClick = async () => {
    if (!currentUser) {
      toast.error('Please sign in to send messages');
      navigate('/login');
      return;
    }
    
    if (currentUser.id === profile?.id) {
      toast.error('You cannot message yourself');
      return;
    }`;

content = content.replace(oldHandler, newHandler);
fs.writeFileSync('src/pages/PublicProfile.tsx', content, 'utf-8');
