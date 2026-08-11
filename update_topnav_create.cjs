const fs = require('fs');
let content = fs.readFileSync('src/components/TopNav.tsx', 'utf-8');

// Add CreateHubModal import
if (!content.includes('CreateHubModal')) {
  content = content.replace(
    'import Logo from "./Logo";',
    'import Logo from "./Logo";\nimport CreateHubModal from "./CreateHubModal";\nimport { Plus } from "lucide-react";'
  );
}

// Add state for modal
if (!content.includes('isCreateModalOpen')) {
  content = content.replace(
    'const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);',
    'const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);\n  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);'
  );
}

// Add create button next to notifications
const oldNotifications = `          <div className="hidden lg:flex items-center gap-4">
            <Link 
              to="/notifications"`;

const newNotifications = `          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple text-white text-sm font-bold hover:bg-brand-purple-dark hover:shadow-glow transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Create
            </button>

            <Link 
              to="/notifications"`;

content = content.replace(oldNotifications, newNotifications);

// Add modal component
const oldReturn = `    </nav>
  );
};`;

const newReturn = `    </nav>
      <CreateHubModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};`;

if (!content.includes('</>')) {
  content = content.replace(oldReturn, newReturn).replace('<nav className={`', '<>\n    <nav className={`');
}

fs.writeFileSync('src/components/TopNav.tsx', content, 'utf-8');
console.log('Added Create button to TopNav');
