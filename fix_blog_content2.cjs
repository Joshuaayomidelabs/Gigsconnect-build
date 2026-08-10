const fs = require('fs');
let content = fs.readFileSync('src/pages/BlogPost.tsx', 'utf-8');

const proseStart = content.indexOf('<div className="prose prose-lg');
const proseEnd = content.indexOf('</div>', content.lastIndexOf('We are building GigsConnect')) + 6;

if (proseStart !== -1 && proseEnd !== -1) {
  const newProse = `<div className="prose prose-lg prose-indigo max-w-none prose-headings:font-bold prose-headings:text-[#111827] prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#6C2BFF] prose-img:rounded-2xl">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>`;
  content = content.substring(0, proseStart) + newProse + content.substring(proseEnd);
}

const tocStart = content.indexOf('<div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">');
if (tocStart !== -1) {
  const tocEnd = content.indexOf('</div>', content.indexOf('Conclusion</a></li>')) + 6;
  if (tocEnd !== -1) {
    content = content.substring(0, tocStart) + content.substring(tocEnd);
  }
}

fs.writeFileSync('src/pages/BlogPost.tsx', content, 'utf-8');
console.log('Fixed BlogPost content again');
