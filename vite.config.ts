import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@tauri-apps/api/core': path.resolve(import.meta.dirname, './src/utils/tauriStub.ts'),
      '@tauri-apps/api/event': path.resolve(import.meta.dirname, './src/utils/tauriStub.ts'),
      '@tauri-apps/api/window': path.resolve(import.meta.dirname, './src/utils/tauriStub.ts'),
      '@tauri-apps/api/app': path.resolve(import.meta.dirname, './src/utils/tauriStub.ts'),
      '@tauri-apps/api': path.resolve(import.meta.dirname, './src/utils/tauriStub.ts'),
      '@tauri-apps/plugin-opener': path.resolve(import.meta.dirname, './src/utils/tauriPluginStub.ts'),
      '@tauri-apps/plugin-dialog': path.resolve(import.meta.dirname, './src/utils/tauriPluginStub.ts'),
      '@tauri-apps/plugin-process': path.resolve(import.meta.dirname, './src/utils/tauriPluginStub.ts'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
