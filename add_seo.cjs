const fs = require('fs');
const path = require('path');

const seoConfig = {
  'Landing.tsx': { title: 'GigsConnect Africa | Connecting Talent with Opportunity' },
  'AboutUs.tsx': { title: 'About GigsConnect | Connecting African Talent With Opportunity', canonical: 'https://gigsconnect.africa/about-us' },
  'Pricing.tsx': { title: 'GigsConnect Pricing | Plans for African Creators', canonical: 'https://gigsconnect.africa/pricing' },
  'FAQs.tsx': { title: 'GigsConnect FAQs | Frequently Asked Questions', canonical: 'https://gigsconnect.africa/faqs' },
  'Blog.tsx': { title: 'GigsConnect Blog | Creator Opportunities, Gigs & Insights', canonical: 'https://gigsconnect.africa/blog' },
  'CreatorsHub.tsx': { title: 'Creators Hub | Resources & Community for African Freelancers', canonical: 'https://gigsconnect.africa/creators-hub' },
  'SuccessStories.tsx': { title: 'Success Stories | GigsConnect Africa', canonical: 'https://gigsconnect.africa/success-stories' },
  'HelpCenter.tsx': { title: 'Help Center | GigsConnect Support', canonical: 'https://gigsconnect.africa/help' },
  'SafetyCenter.tsx': { title: 'Safety Center | Trust & Security on GigsConnect', canonical: 'https://gigsconnect.africa/safety-center' },
  'PrivacyPolicy.tsx': { title: 'Privacy Policy | GigsConnect', canonical: 'https://gigsconnect.africa/privacy' },
  'TermsAndConditions.tsx': { title: 'Terms & Conditions | GigsConnect', canonical: 'https://gigsconnect.africa/terms' },
  'CookiePolicy.tsx': { title: 'Cookie Policy | GigsConnect', canonical: 'https://gigsconnect.africa/cookie-policy' },
  'CopyrightPolicy.tsx': { title: 'Copyright Policy | GigsConnect', canonical: 'https://gigsconnect.africa/copyright' },
  'AcceptableUsePolicy.tsx': { title: 'Acceptable Use Policy | GigsConnect', canonical: 'https://gigsconnect.africa/acceptable-use' },
  'ReportAbuse.tsx': { title: 'Report Abuse | GigsConnect', canonical: 'https://gigsconnect.africa/report-abuse' },
  'BrowseGigs.tsx': { title: 'Find Gigs | Browse Opportunities on GigsConnect', canonical: 'https://gigsconnect.africa/browse' },
  
  // Noindex pages
  'Login.tsx': { title: 'Log In | GigsConnect', noindex: true },
  'SignUp.tsx': { title: 'Sign Up | GigsConnect', noindex: true },
  'ForgotPassword.tsx': { title: 'Reset Password | GigsConnect', noindex: true },
  'ResetPassword.tsx': { title: 'Reset Password | GigsConnect', noindex: true },
  'Dashboard.tsx': { title: 'Dashboard | GigsConnect', noindex: true },
  'EditProfile.tsx': { title: 'Edit Profile | GigsConnect', noindex: true },
  'Settings.tsx': { title: 'Settings | GigsConnect', noindex: true },
  'Messages.tsx': { title: 'Messages | GigsConnect', noindex: true },
  'Notifications.tsx': { title: 'Notifications | GigsConnect', noindex: true },
  'MyApplications.tsx': { title: 'My Applications | GigsConnect', noindex: true },
  'MyPostedGigs.tsx': { title: 'My Posted Gigs | GigsConnect', noindex: true },
  'PostGig.tsx': { title: 'Create | GigsConnect', noindex: true },
  'CreatorWelcome.tsx': { title: 'Welcome | GigsConnect', noindex: true },
  'CreatorSkills.tsx': { title: 'Select Skills | GigsConnect', noindex: true },
  'CreatorLocation.tsx': { title: 'Location | GigsConnect', noindex: true },
  'CreatorCategories.tsx': { title: 'Categories | GigsConnect', noindex: true },
  'CreateProfile.tsx': { title: 'Create Profile | GigsConnect', noindex: true },
  'Chat.tsx': { title: 'Chat | GigsConnect', noindex: true },
  'ApplyToGig.tsx': { title: 'Apply | GigsConnect', noindex: true },
};

Object.entries(seoConfig).forEach(([filename, config]) => {
  const filePath = path.join('src/pages', filename);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping \${filename}, file not found.`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (content.includes('<SEO ')) {
    console.log(`Skipping \${filename}, SEO already present.`);
    return;
  }

  // Import SEO
  if (!content.includes("import { SEO }")) {
    // Add import after the last import statement or at the top
    const importMatch = content.match(/import .*?;?\n/g);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      content = content.replace(lastImport, lastImport + "import { SEO } from '../components/SEO';\n");
    } else {
      content = "import { SEO } from '../components/SEO';\n" + content;
    }
  }

  // Find the first main/div after return statement and insert SEO
  // A generic way is to look for `return (` and insert `<SEO ... />` right after the wrapper element
  // Or just right after `return (` if we can wrap with a fragment.
  // Actually, many files return a wrapper `div` or `<>`. Let's just do a regex replace on the first JSX element returned.
  
  const returnRegex = /(return\s*\(\s*)([a-zA-Z0-9_<>]+.*?>)/s;
  const match = content.match(returnRegex);
  
  if (match) {
    let seoTag = `\n      <SEO title="${config.title}"`;
    if (config.canonical) seoTag += ` canonical="${config.canonical}"`;
    if (config.noindex) seoTag += ` noindex={true}`;
    seoTag += ` />\n`;
    
    // We need to ensure we don't break the single root element rule in React. 
    // If the component returns `<div...`, we can inject it *inside* the div.
    // If it returns `<>...`, we can inject it inside.
    const isFragment = match[2].startsWith('<>');
    
    // Let's just insert inside the top-level element
    content = content.replace(returnRegex, `$1$2${seoTag}`);
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated \${filename} with SEO`);
  } else {
    console.log(`Could not find return statement in \${filename}`);
  }
});
