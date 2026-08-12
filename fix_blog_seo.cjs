const fs = require('fs');
let content = fs.readFileSync('src/pages/BlogPost.tsx', 'utf-8');

if (!content.includes('<SEO')) {
  content = content.replace("import { BLOG_POSTS }", "import { SEO } from '../components/SEO';\nimport { BLOG_POSTS }");
  
  const seoTag = `
      {post && (
        <SEO 
          title={\`\${post.title} | GigsConnect Blog\`}
          description={post.excerpt}
          image={post.image}
          type="article"
          canonical={\`https://gigsconnect.africa/blog/\${post.slug}\`}
        />
      )}
`;

  content = content.replace('return (\n    <div className="pt-main', 'return (\n    <div className="pt-main' + seoTag);
  
  fs.writeFileSync('src/pages/BlogPost.tsx', content, 'utf-8');
  console.log('Added dynamic SEO to BlogPost.tsx');
}
