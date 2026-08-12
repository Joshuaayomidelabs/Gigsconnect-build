const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const routesToLazyLoad = [
  'Login', 'SignUp', 'ForgotPassword', 'ResetPassword', 'Dashboard', 'Messages',
  'Chat', 'BrowseGigs', 'PostGig', 'MyApplications', 'MyPostedGigs', 'EditProfile',
  'CreateProfile', 'CreatorCategories', 'CreatorSkills', 'CreatorLocation', 'CreatorWelcome',
  'Notifications', 'GigDetails', 'PublicProfile', 'ApplicationDetails', 'PostDetails',
  'Settings', 'Blog', 'BlogPost', 'Analytics', 'TermsAndConditions', 'PrivacyPolicy',
  'CommunityGuidelines', 'CookiePolicy', 'CopyrightPolicy', 'AcceptableUsePolicy',
  'ReportAbuse', 'HelpCenter', 'SafetyCenter', 'FAQs', 'Pricing', 'AboutUs',
  'SuccessStories', 'CreatorsHub'
];

let newImports = '';
let replacedContent = content;

routesToLazyLoad.forEach(route => {
  const importRegex = new RegExp(`import ${route} from '\\./pages/${route}';\\n?`, 'g');
  if (replacedContent.match(importRegex)) {
    replacedContent = replacedContent.replace(importRegex, '');
    newImports += `const ${route} = React.lazy(() => import('./pages/${route}'));\n`;
  }
});

// FeaturedCreators is imported with {}
const fcImportRegex = new RegExp(`import { FeaturedCreators } from '\\./pages/FeaturedCreators';\\n?`, 'g');
if (replacedContent.match(fcImportRegex)) {
  replacedContent = replacedContent.replace(fcImportRegex, '');
  newImports += `const FeaturedCreators = React.lazy(() => import('./pages/FeaturedCreators').then(module => ({ default: module.FeaturedCreators })));\n`;
}

// Add new imports after the last normal import
const lastImportIndex = replacedContent.lastIndexOf('import ');
const endOfLastImport = replacedContent.indexOf('\n', lastImportIndex);
replacedContent = replacedContent.substring(0, endOfLastImport + 1) + '\n// Lazy-loaded routes\n' + newImports + replacedContent.substring(endOfLastImport + 1);

// We need to wrap <Routes> with <React.Suspense>
// Find `<Routes>` and replace
replacedContent = replacedContent.replace(
  '<Routes>',
  '<React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-brand-gray dark:bg-brand-black"><div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div></div>}>\n            <Routes>'
);
replacedContent = replacedContent.replace(
  '</Routes>',
  '</Routes>\n            </React.Suspense>'
);

fs.writeFileSync('src/App.tsx', replacedContent, 'utf-8');
console.log('Lazy loaded routes in App.tsx');

