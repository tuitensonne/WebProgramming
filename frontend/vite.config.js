import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        client: resolve(__dirname, 'client.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
});
