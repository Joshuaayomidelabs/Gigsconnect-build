const fs = require('fs');
let content = fs.readFileSync('src/components/messages/RichComposer.tsx', 'utf-8');

// The block:
// <AnimatePresence mode="popLayout">
//   {(text.trim() || justSent) && (
//     <motion.button

content = content.replace(/<AnimatePresence mode="popLayout">\s*\{\(text\.trim\(\) \|\| justSent\) && \(/, '<AnimatePresence mode="popLayout">');
content = content.replace(/<\/motion\.button>\s*\)\}\s*<\/AnimatePresence>/, '</motion.button>\n        </AnimatePresence>');

fs.writeFileSync('src/components/messages/RichComposer.tsx', content, 'utf-8');
