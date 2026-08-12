const fs = require('fs');
let content = fs.readFileSync('src/pages/GigDetails.tsx', 'utf-8');

if (!content.includes('<SEO')) {
  content = content.replace("import { toast }", "import { SEO } from '../components/SEO';\nimport { toast }");
  
  const seoTag = `
      {gig && (
        <SEO 
          title={\`\${gig.title} | GigsConnect\`}
          description={gig.description ? gig.description.substring(0, 150) + '...' : 'Gig opportunity on GigsConnect'}
          type="article"
          canonical={\`https://gigsconnect.africa/gigs/\${gig.id}\`}
        />
      )}
`;

  // Look for the main container. It usually is something like `<div className="pt-main min-h-screen">` or `<div className="pb-24">`
  // Actually, we can inject it right after the outermost container. Let's find `return (` and inject it after the next tag.
  const returnRegex = /(return\s*\(\s*)([a-zA-Z0-9_<>]+.*?>)/s;
  const match = content.match(returnRegex);
  
  if (match) {
    content = content.replace(returnRegex, `$1$2${seoTag}`);
    fs.writeFileSync('src/pages/GigDetails.tsx', content, 'utf-8');
    console.log('Added dynamic SEO to GigDetails.tsx');
  } else {
    console.log('Could not find return statement in GigDetails.tsx');
  }
}
