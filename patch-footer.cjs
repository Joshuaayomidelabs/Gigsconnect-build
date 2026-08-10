const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

// Add SOCIAL_LINKS constant before the component
const targetConst = `const Footer = () => {`;
const replacementConst = `const SOCIAL_LINKS = {
  twitter: 'https://twitter.com', // Replace with official GigsConnect URL
  instagram: 'https://instagram.com', // Replace with official GigsConnect URL
  linkedin: 'https://linkedin.com', // Replace with official GigsConnect URL
  facebook: 'https://facebook.com', // Replace with official GigsConnect URL
};

const Footer = () => {`;
if (content.includes(targetConst)) {
  content = content.replace(targetConst, replacementConst);
}

// Replace handleSubscribe to show "coming soon" instead of "success"
const targetHandle = `  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };`;
const replacementHandle = `  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // Temporary state: Newsletter backend is not yet implemented
      setSubscribed(true);
    }
  };`;
if (content.includes(targetHandle)) {
  content = content.replace(targetHandle, replacementHandle);
}

// Replace the success message
const targetMessage = `<p className="text-emerald-400 text-sm font-medium">Thanks for subscribing!</p>`;
const replacementMessage = `<p className="text-emerald-400 text-sm font-medium">Newsletter signup is coming soon.</p>`;
if (content.includes(targetMessage)) {
  content = content.replace(targetMessage, replacementMessage);
}

// Replace social links
const targetSocial = `            <div className="flex items-center gap-4">
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
            </div>`;

const replacementSocial = `            <div className="flex items-center gap-4">
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#4B0082] hover:text-white transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
            </div>`;
if (content.includes(targetSocial)) {
  content = content.replace(targetSocial, replacementSocial);
}

// Fix contact support email anchor tag
const targetEmail = `<li><a href="mailto:support@gigsconnect.africa" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Contact Support</a></li>`;
const replacementEmail = `<li><a href="mailto:support@gigsconnect.africa" aria-label="Contact Support" className="text-gray-400 hover:text-[#4B0082] text-sm font-medium transition-colors">Contact Support</a></li>`;
if (content.includes(targetEmail)) {
  content = content.replace(targetEmail, replacementEmail);
}

fs.writeFileSync('src/components/Footer.tsx', content, 'utf-8');
console.log('Successfully patched Footer.tsx');
