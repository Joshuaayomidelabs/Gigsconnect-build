import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
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
  },
  optimizeDeps: {
    include: ['motion/react', 'lucide-react', 'react-router-dom', 'sonner']
  }
});
