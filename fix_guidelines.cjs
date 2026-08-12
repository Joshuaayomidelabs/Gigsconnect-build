const fs = require('fs');
let content = fs.readFileSync('src/pages/CommunityGuidelines.tsx', 'utf-8');

if (!content.includes('<SEO')) {
  content = content.replace("import { ChevronDown", "import { SEO } from '../components/SEO';\nimport { ChevronDown");
  
  const seoTag = `
      <SEO 
        title="Community Guidelines | GigsConnect"
        description="Our Community Guidelines for a safe, respectful, and professional environment on GigsConnect."
        canonical="https://gigsconnect.africa/community-guidelines"
      />
`;

  const returnRegex = /(return\s*\(\s*)([a-zA-Z0-9_<>]+.*?>)/s;
  const match = content.match(returnRegex);
  
  if (match) {
    content = content.replace(returnRegex, `$1$2${seoTag}`);
    fs.writeFileSync('src/pages/CommunityGuidelines.tsx', content, 'utf-8');
    console.log('Added SEO to CommunityGuidelines.tsx');
  }
}
