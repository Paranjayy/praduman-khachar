import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

/**
 * Write a build-info.json file with the build timestamp so the
 * Footer can show "Updated 5m ago" accurately.
 */
const buildInfoPlugin = () => ({
  name: 'build-info',
  buildStart() {
    try {
      const publicDir = resolve(process.cwd(), 'public')
      mkdirSync(publicDir, { recursive: true })
      const info = {
        builtAt: new Date().toISOString(),
        version: process.env.npm_package_version || '0.0.0',
      }
      writeFileSync(
        resolve(publicDir, 'build-info.json'),
        JSON.stringify(info, null, 2),
      )
    } catch (e) {
      console.warn('build-info plugin:', e.message)
    }
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), buildInfoPlugin()],
})
