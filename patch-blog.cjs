const fs = require('fs');

let content = fs.readFileSync('src/pages/Blog.tsx', 'utf-8');

const target1 = `  {
    id: 'b-1',
    title: 'GigsConnect Raises $5M Seed Round to Empower African Creators',
    slug: 'gigsconnect-raises-5m-seed',
    cover_image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'We are thrilled to announce our latest funding round, aimed at building more tools, expanding across the continent, and bringing global opportunities to local talent.',
    content: '<p>Lorem ipsum...</p>', // Placeholder for content
    author_name: 'Obi Nwosu',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    category: 'Company News',
    tags: ['#Announcements', '#Funding', '#Startup'],
    reading_time: '4 min read',
    published_at: 'Oct 24, 2023',
    featured: true,
    views: 12500,
    likes: 342,
    comments_count: 56,
    status: 'published'
  },`;

const replacement1 = `  {
    id: 'b-1',
    title: 'Welcome to the GigsConnect Blog: Empowering African Creators',
    slug: 'welcome-to-gigsconnect',
    cover_image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'We are thrilled to launch the GigsConnect blog! Stay tuned for product updates, creator spotlights, and tips to grow your freelance career.',
    content: '<p>Content coming soon...</p>', 
    author_name: 'GigsConnect Editorial',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    category: 'Company News',
    tags: ['#Announcements', '#Community', '#Platform'],
    reading_time: '2 min read',
    published_at: 'Oct 24, 2023',
    featured: true,
    views: 1250,
    likes: 142,
    comments_count: 12,
    status: 'published'
  },`;

if (content.includes(target1)) {
  content = content.replace(target1, replacement1);
  fs.writeFileSync('src/pages/Blog.tsx', content, 'utf-8');
  console.log('Successfully patched Blog.tsx');
} else {
  console.log('Target string not found in Blog.tsx');
}

let postContent = fs.readFileSync('src/pages/BlogPost.tsx', 'utf-8');

const target2 = `              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

const replacement2 = `              Welcome to the GigsConnect blog. Here we will be sharing the latest platform updates, tips for standing out to clients, and inspiring stories from our creator community across Africa.`;

const target3 = `              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;

const replacement3 = `              Stay tuned as we bring you more insights on how to build a lasting creative career. From negotiating rates to showcasing your portfolio effectively, we've got you covered.`;

if (postContent.includes(target2)) {
  postContent = postContent.replace(target2, replacement2);
  postContent = postContent.replace(target3, replacement3);
  fs.writeFileSync('src/pages/BlogPost.tsx', postContent, 'utf-8');
  console.log('Successfully patched BlogPost.tsx');
} else {
  console.log('Target string not found in BlogPost.tsx');
}
