const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

if (!content.includes("import { toast } from 'sonner';")) {
  content = content.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { toast } from 'sonner';");
}

const handleSocialClick = `const handleSocialClick = (e: React.MouseEvent, platform: string) => {
    e.preventDefault();
    toast.info(\`\${platform} integration coming soon.\`);
  };`;

if (!content.includes('handleSocialClick')) {
  content = content.replace('const handleSubscribe = (e: React.FormEvent) => {', handleSocialClick + '\n\n  const handleSubscribe = (e: React.FormEvent) => {');
}

// Replace the anchors with buttons
const aTwitter = `<a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>`;
const aInstagram = `<a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>`;
const aLinkedin = `<a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>`;
const aFacebook = `<a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>`;

const bTwitter = `<button onClick={(e) => handleSocialClick(e, 'Twitter')} aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300 cursor-pointer">
                <Twitter className="w-4 h-4" />
              </button>`;
const bInstagram = `<button onClick={(e) => handleSocialClick(e, 'Instagram')} aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300 cursor-pointer">
                <Instagram className="w-4 h-4" />
              </button>`;
const bLinkedin = `<button onClick={(e) => handleSocialClick(e, 'LinkedIn')} aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300 cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </button>`;
const bFacebook = `<button onClick={(e) => handleSocialClick(e, 'Facebook')} aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300 cursor-pointer">
                <Facebook className="w-4 h-4" />
              </button>`;

content = content.replace(aTwitter, bTwitter);
content = content.replace(aInstagram, bInstagram);
content = content.replace(aLinkedin, bLinkedin);
content = content.replace(aFacebook, bFacebook);

fs.writeFileSync('src/components/Footer.tsx', content, 'utf-8');
console.log('Fixed Footer social links');
