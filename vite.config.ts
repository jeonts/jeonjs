import { defineConfig } from 'vite'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

// Dual build configuration
// 1. Library build: src/index.ts -> dist/
// 2. App build: index.html -> docs/

export default defineConfig(({ command, mode }) => {
  // Library build configuration
  if (mode === 'lib') {
    return {
      build: {
        // Library build
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'jeon-converter',
          formats: ['es', 'cjs'],
          fileName: (format) => `jeon-converter.${format}.js`
        },
        outDir: 'dist',
        rollupOptions: {
          // Externalize dependencies for the library build
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
    }
  }

  // App build configuration (default)
  return {
    build: {
      // App build for documentation/demo
      outDir: 'docs',
      assetsDir: 'assets',
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Generate manifest for deployment tracking
      manifest: true,
      // Minify for production
      minify: 'esbuild',
      // Generate sourcemaps for production
      sourcemap: true
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
    },
    plugins: [
      tailwindcss()
    ]
  }
})