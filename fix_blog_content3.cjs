const fs = require('fs');
let content = fs.readFileSync('src/pages/BlogPost.tsx', 'utf-8');

const regex = /<div className="prose prose-lg[\s\S]*?We are building GigsConnect[\s\S]*?<\/div>\n\s*<\/div>/g;

content = content.replace(regex, `<div className="prose prose-lg prose-indigo max-w-none prose-headings:font-bold prose-headings:text-[#111827] prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#6C2BFF] prose-img:rounded-2xl">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>`);

// It looks like I messed up and added a semicolon or duplicate. Let's do a clean rebuild of the main content section.
const mainContentRegex = /\{\/\* Main Content \*\/\}([\s\S]*?)<div className="mt-12 pt-8 border-t border-gray-100">/g;

content = content.replace(mainContentRegex, `{/* Main Content */}
        <div className="flex-1 max-w-[800px]">
          <div className="prose prose-lg prose-indigo max-w-none prose-headings:font-bold prose-headings:text-[#111827] prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#6C2BFF] prose-img:rounded-2xl">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100">`);

fs.writeFileSync('src/pages/BlogPost.tsx', content, 'utf-8');
console.log('Fixed BlogPost correctly');
