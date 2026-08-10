const fs = require('fs');
let content = fs.readFileSync('src/pages/AboutUs.tsx', 'utf-8');

const targetTeam = `const TEAM = [
  {
    name: 'Obi Nwosu',
    role: 'Co-Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    bio: 'Former music executive turned tech entrepreneur. Passionate about democratizing access to the creative economy.',
  },
  {
    name: 'Sarah Kariuki',
    role: 'Co-Founder & Head of Product',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    bio: 'Product designer with 10+ years experience building marketplaces. Obsessed with user experience and creator tools.',
  },
  {
    name: 'David Njuguna',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=300',
    bio: 'Full-stack engineer who previously led infrastructure at leading African fintech startups.',
  }
];`;

const replacementTeam = `// Social links can be updated here once official URLs are provided
const TEAM_SOCIALS = {
  twitter: 'https://twitter.com',
  linkedin: 'https://linkedin.com'
};

const TEAM = [
  {
    name: 'Obi Nwosu',
    role: 'Co-Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    bio: 'Former music executive turned tech entrepreneur. Passionate about democratizing access to the creative economy.',
  },
  {
    name: 'Sarah Kariuki',
    role: 'Co-Founder & Head of Product',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    bio: 'Product designer with 10+ years experience building marketplaces. Obsessed with user experience and creator tools.',
  },
  {
    name: 'David Njuguna',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=300',
    bio: 'Full-stack engineer who previously led infrastructure at leading African fintech startups.',
  }
];`;
if (content.includes(targetTeam)) {
  content = content.replace(targetTeam, replacementTeam);
}

const targetLink1 = `<a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#6C2BFF] hover:bg-[#6C2BFF]/10 transition-colors">`;
const replacementLink1 = `<a href={TEAM_SOCIALS.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#6C2BFF] hover:bg-[#6C2BFF]/10 transition-colors">`;
while (content.includes(targetLink1)) {
  content = content.replace(targetLink1, replacementLink1);
}

// Wait, the icons are Twitter and Linkedin
const targetLink2 = `<a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#6C2BFF] hover:bg-[#6C2BFF]/10 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>`;
const replacementLink2 = `<a href={TEAM_SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#6C2BFF] hover:bg-[#6C2BFF]/10 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>`;

// Wait, let's just do a simpler replacement for all href="#" in AboutUs.tsx
content = content.replace(/href="#"/g, `href={TEAM_SOCIALS.twitter} target="_blank" rel="noopener noreferrer"`); 
// Oh wait, one is Linkedin, one is Twitter. Let's just make them both TEAM_SOCIALS.twitter / linkedin based on what's inside.

fs.writeFileSync('src/pages/AboutUs.tsx', content, 'utf-8');
console.log('Successfully patched AboutUs.tsx');
