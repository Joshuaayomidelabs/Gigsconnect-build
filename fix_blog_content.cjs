const fs = require('fs');
let content = fs.readFileSync('src/pages/BlogPost.tsx', 'utf-8');

// Replace the prose section with simple dynamic content representation or generic content
const startIdx = content.indexOf('<div className="prose prose-lg');
const endIdx = content.indexOf('</div>', content.indexOf('</div>', content.indexOf('</div>', startIdx) + 1)); // Wait, this might be tricky with regex.

// Let's just use string replacement for the entire main content block.
const oldContent = `<div className="prose prose-lg prose-indigo max-w-none prose-headings:font-bold prose-headings:text-[#111827] prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#6C2BFF] prose-img:rounded-2xl">
            {/* 
               In a real implementation with a CMS, this would be rendered using a Markdown parser 
               or a rich text renderer like dangerouslySetInnerHTML for HTML content. 
               For this mockup, we'll simulate a rich article body.
            */}
            <p className="lead text-xl text-gray-700 font-medium mb-8">
              {post.excerpt}
            </p>
            
            <h2>The Changing Landscape</h2>
            <p>
              Welcome to the GigsConnect blog. Here we will be sharing the latest platform updates, tips for standing out to clients, and inspiring stories from our creator community across Africa.
            </p>
            
            <blockquote>
              "The future of work in Africa is digital, decentralized, and driven by incredible creative talent that has been historically overlooked by global platforms."
            </blockquote>
            
            <p>
              As the digital economy grows, so does the demand for authentic, localized content. Brands are increasingly looking for creators who understand specific markets.
            </p>

            <h3>Key Takeaways for Creators</h3>
            <ul>
              <li><strong>Focus on value:</strong> Deliver exceptional quality that speaks for itself.</li>
              <li><strong>Build a network:</strong> Collaborate with other creators to expand your reach.</li>
              <li><strong>Stay consistent:</strong> Success on platforms like GigsConnect comes from a track record of reliability.</li>
            </ul>
            
            <p>
              We are building GigsConnect to be the definitive launchpad for this creative revolution. Whether you are a designer in Lagos, a developer in Nairobi, or a writer in Accra, this platform is built for you.
            </p>
          </div>`;

const newContent = `<div className="prose prose-lg prose-indigo max-w-none prose-headings:font-bold prose-headings:text-[#111827] prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#6C2BFF] prose-img:rounded-2xl" dangerouslySetInnerHTML={{ __html: post.content }}>
          </div>`;

content = content.replace(oldContent, newContent);

// Remove the Table of Contents completely from the sidebar
const sidebarOld = `<div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h4 className="font-bold text-[#111827] mb-4 uppercase tracking-wider text-sm">Table of Contents</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#content" className="hover:text-[#6C2BFF] transition-colors">The Changing Landscape</a></li>
                <li><a href="#content" className="hover:text-[#6C2BFF] transition-colors">Key Takeaways for Creators</a></li>
                <li><a href="#content" className="hover:text-[#6C2BFF] transition-colors pl-4">Focus on value</a></li>
                <li><a href="#content" className="hover:text-[#6C2BFF] transition-colors pl-4">Build a network</a></li>
                <li><a href="#content" className="hover:text-[#6C2BFF] transition-colors">Conclusion</a></li>
              </ul>
            </div>`;

content = content.replace(sidebarOld, '');

fs.writeFileSync('src/pages/BlogPost.tsx', content, 'utf-8');
console.log('Fixed BlogPost content');
