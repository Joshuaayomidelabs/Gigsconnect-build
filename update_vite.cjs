const fs = require('fs');

let content = fs.readFileSync('vite.config.ts', 'utf-8');
const newBuildOptions = `
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react', 'motion', 'motion/react', 'sonner']
        }
      }
    }
  },`;

if (!content.includes('build: {')) {
  content = content.replace('optimizeDeps: {', newBuildOptions + '\n  optimizeDeps: {');
  fs.writeFileSync('vite.config.ts', content, 'utf-8');
  console.log('Updated vite.config.ts');
}
