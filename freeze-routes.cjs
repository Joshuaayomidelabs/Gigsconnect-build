const fs = require('fs');

const freezeComponent = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const frozenContent = `import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const FrozenComponent: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    toast('Messaging is coming soon.', {
      description: "We're working on bringing messaging to GigsConnect."
    });
    navigate('/overview', { replace: true });
  }, [navigate]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-brand-white dark:bg-brand-black">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-black dark:text-brand-white">Messaging is coming soon</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Redirecting...</p>
      </div>
    </div>
  );
};

export default FrozenComponent;
`;
  
  // We don't want to completely lose the old code, so let's just rename it and put the frozen one.
  // Wait, the prompt says "Do not delete messaging files... keep all existing messaging implementation files".
  // It's safer to just comment out the default export or modify it.
  
  // Actually, we can just prepend the FrozenComponent and change the default export.
  const oldExportMatch = content.match(/export default ([A-Za-z0-9_]+);/);
  if (oldExportMatch) {
    const oldExport = oldExportMatch[1];
    
    // Check if already frozen
    if (content.includes('FrozenComponent')) {
        console.log(`Already frozen: ${filePath}`);
        return;
    }

    content = content.replace(/export default [A-Za-z0-9_]+;/, `
import { toast as sonnerToast } from 'sonner';
import { useNavigate as useFrozenNavigate } from 'react-router-dom';

const FrozenComponent: React.FC = () => {
  const navigate = useFrozenNavigate();
  
  React.useEffect(() => {
    sonnerToast('Messaging is coming soon.', {
      description: "We're working on bringing messaging to GigsConnect."
    });
    navigate('/overview', { replace: true });
  }, [navigate]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-brand-white dark:bg-brand-black">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-black dark:text-brand-white">Messaging is coming soon</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Redirecting...</p>
      </div>
    </div>
  );
};

export default FrozenComponent;
`);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Frozen ${filePath}`);
  }
};

freezeComponent('src/pages/Messages.tsx');
freezeComponent('src/pages/Chat.tsx');

