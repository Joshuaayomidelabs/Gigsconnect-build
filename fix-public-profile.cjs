const fs = require('fs');
let content = fs.readFileSync('src/pages/PublicProfile.tsx', 'utf-8');

// Add import
if (!content.includes("getOrCreateDirectConversation")) {
  content = content.replace("import { handleError, notifyError } from '../utils/errorHandler';", "import { handleError, notifyError } from '../utils/errorHandler';\nimport { getOrCreateDirectConversation } from '../services/messagesService';");
}

// Add state
if (!content.includes("isCreatingConversation")) {
  content = content.replace("const [isFollowing, setIsFollowing] = useState(false);", "const [isFollowing, setIsFollowing] = useState(false);\n  const [isCreatingConversation, setIsCreatingConversation] = useState(false);");
}

// Add handler
const handler = `
  const handleMessageClick = async () => {
    if (!user) {
      toast.error('Please sign in to send messages');
      navigate('/login');
      return;
    }
    
    if (user.id === profile?.id) {
      toast.error('You cannot message yourself');
      return;
    }

    try {
      setIsCreatingConversation(true);
      const conversationId = await getOrCreateDirectConversation(profile!.id);
      navigate('/messages/' + conversationId);
    } catch (err: any) {
      handleError(err, 'Failed to start conversation');
    } finally {
      setIsCreatingConversation(false);
    }
  };
`;

if (!content.includes("handleMessageClick")) {
  content = content.replace("const handleFollowToggle = async () => {", handler + "\n  const handleFollowToggle = async () => {");
}

// Update button
const oldButton = `<button 
                  onClick={() => navigate(\`/messages/\${profile.id}\`)}`;
const newButton = `<button 
                  onClick={handleMessageClick}
                  disabled={isCreatingConversation}`;
content = content.replace(oldButton, newButton);

fs.writeFileSync('src/pages/PublicProfile.tsx', content, 'utf-8');
