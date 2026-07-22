const fs = require('fs');
let content = fs.readFileSync('src/components/SubscriptionCard.tsx', 'utf8');

if (!content.includes('import { useNavigate }')) {
  content = content.replace("import { useSubscription } from '../context/SubscriptionContext';", "import { useSubscription } from '../context/SubscriptionContext';\nimport { useNavigate } from 'react-router-dom';");
}

if (!content.includes('const navigate = useNavigate();')) {
  content = content.replace('const { subscription, isLoading } = useSubscription();', 'const { subscription, isLoading } = useSubscription();\n  const navigate = useNavigate();');
}

const targetBtn = `<button 
          className={\`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95 \${
            isStarter 
              ? 'bg-brand-purple text-white hover:bg-brand-purple-hover hover:shadow-brand-purple/20' 
              : 'bg-brand-gray dark:bg-brand-black text-brand-black dark:text-brand-white border border-brand-gray dark:border-brand-black hover:border-brand-purple'
          }\`}
        >
          Manage Subscription
        </button>`;

const newBtn = `<button 
          onClick={() => navigate(isStarter ? '/pricing' : '/settings')}
          className={\`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95 \${
            isStarter 
              ? 'bg-brand-purple text-white hover:bg-brand-purple-hover hover:shadow-brand-purple/20' 
              : 'bg-brand-gray dark:bg-brand-black text-brand-black dark:text-brand-white border border-brand-gray dark:border-brand-black hover:border-brand-purple'
          }\`}
        >
          {isStarter ? 'Upgrade Plan' : 'Manage Subscription'}
        </button>`;

content = content.replace(targetBtn, newBtn);
fs.writeFileSync('src/components/SubscriptionCard.tsx', content);
