import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'jeon-converter',
      formats: ['es', 'cjs'],
      fileName: (format) => `jeon-converter.${format}.js`
    },
    rollupOptions: {
      external: ['typescript', 'acorn', 'woby', 'json5'],
      output: {
        globals: {
          typescript: 'ts',
          acorn: 'acorn',
          woby: 'woby',
          json5: 'JSON5'
        }
      }
    }
  },
  server: {
    open: '/index.html'
  },
  esbuild: {
    loader: 'tsx',
    include: /\.[jt]sx?$/,
    exclude: /node_modules/
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx'
      }
    }
  }
})