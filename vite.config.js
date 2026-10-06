import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Write a build-info.json file with the build timestamp so the
 * Footer can show "Updated 5m ago" accurately.
 */
const buildInfoPlugin = () => ({
  name: 'build-info',
  generateBundle() {
      const info = {
        builtAt: new Date().toISOString(),
        version: process.env.npm_package_version || '0.0.0',
      }
      this.emitFile({ type: 'asset', fileName: 'build-info.json', source: JSON.stringify(info, null, 2) })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), buildInfoPlugin()],
})
