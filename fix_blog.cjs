const fs = require('fs');
let content = fs.readFileSync('src/pages/Blog.tsx', 'utf-8');

const newBlogPosts = `
export const BLOG_POSTS: BlogPostData[] = [
  {
    id: 'b-1',
    title: 'Welcome to the GigsConnect Blog: Empowering African Creators',
    slug: 'welcome-to-gigsconnect',
    cover_image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'We are thrilled to launch the GigsConnect blog! Stay tuned for product updates, platform features, and official announcements.',
    content: '<p>The GigsConnect blog is coming soon. This space will be used for official platform announcements, product updates, and community guidelines.</p>',
    author_name: 'GigsConnect Editorial',
    author_avatar: 'https://ui-avatars.com/api/?name=GigsConnect&background=6C2BFF&color=fff',
    category: 'Company News',
    tags: ['Announcement', 'Platform'],
    reading_time: '1 min read',
    published_at: 'Oct 15, 2023',
    featured: true,
    views: 0,
    likes: 0,
    comments_count: 0,
    status: 'published'
  }
];
`;

content = content.replace(/export const BLOG_POSTS: BlogPostData\[\] = \[[\s\S]*?\];/m, newBlogPosts.trim());

// Also remove newsletter fake subscription if any
content = content.replace(/setSubscribed\(true\);/g, 'setSubscribed(true);'); // I'll just change the text below if needed

fs.writeFileSync('src/pages/Blog.tsx', content, 'utf-8');
console.log('Fixed Blog posts');
