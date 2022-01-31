import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig((...args) => {
  let rootPath = '../';

  const config = {
    plugins: [
      viteCommonjs(),
      tsconfigPaths({
        projects: [rootPath + 'tsconfig.vite.json'],
      }),
    ],
    root: '.',
    base: '/sadelica-new-world/',
    publicDir: rootPath + '/res/',
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      // pure: ['console.log', 'console.debug', 'console.warn'],
    },
    build: {
      outDir: rootPath + 'dist',
      assetsDir: 'release',
      cssCodeSplit: false,
    },
    server: {
      open: 'index.html',
      // lets TILED export json directly into project without permission errors in windows
      watch: {
        usePolling: true,
      },
      proxy: {
        // This prevents the dev server from serving the 'res' version of these scripts since
        // it shares the same directory structure as the src version
        '^/img/.*': 'http://localhost:8080/src/',
      },
    },
  };
  return config;
});
