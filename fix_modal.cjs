const fs = require('fs');
let content = fs.readFileSync('src/components/CreateHubModal.tsx', 'utf-8');

const oldClassNameRegex = /className="fixed bottom-0 left-0 right-0 z-\[101\] max-w-\[600px\] mx-auto bg-white dark:bg-\[#1a1a1a\] rounded-t-\[32px\] sm:rounded-\[32px\] sm:bottom-auto sm:top-1\/2 sm:-translate-y-1\/2 sm:initial=\{\{.*?\}\} shadow-2xl p-6 pb-safe"/;

const newClassName = `className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:top-[50vh] sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[101] w-full max-w-[600px] bg-white dark:bg-brand-black rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6 border border-transparent dark:border-brand-dark-card"`;

// Need to remove the invalid string.
content = content.replace(/className="fixed bottom-0 left-0 right-0 z-\[101\] max-w-\[600px\].*?shadow-2xl p-6 pb-safe"/, newClassName);

fs.writeFileSync('src/components/CreateHubModal.tsx', content, 'utf-8');
console.log('Fixed CreateHubModal classname');
