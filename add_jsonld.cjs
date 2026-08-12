const fs = require('fs');
let content = fs.readFileSync('src/pages/Landing.tsx', 'utf-8');

const jsonLd = `
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GigsConnect",
    "url": "https://gigsconnect.africa",
    "logo": "https://gigsconnect.africa/default-og-image.jpg",
    "description": "GigsConnect is the premier platform connecting African creators, freelancers, and talent with top gig opportunities, collaborations, and brands."
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GigsConnect",
    "url": "https://gigsconnect.africa"
  };
`;

if (!content.includes('organizationSchema')) {
  content = content.replace('const Landing: React.FC = () => {', 'const Landing: React.FC = () => {' + jsonLd);
  
  // Now add it to SEO
  const helmetImport = "import { Helmet } from 'react-helmet-async';";
  if (!content.includes(helmetImport)) {
    content = content.replace("import { SEO } from '../components/SEO';", "import { SEO } from '../components/SEO';\n" + helmetImport);
  }
  
  const tags = `
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      </Helmet>
`;
  content = content.replace('<SEO title="GigsConnect Africa | Connecting Talent with Opportunity" />', '<SEO title="GigsConnect Africa | Connecting Talent with Opportunity" />' + tags);
  
  fs.writeFileSync('src/pages/Landing.tsx', content, 'utf-8');
  console.log('Added JSON-LD to Landing.tsx');
}
