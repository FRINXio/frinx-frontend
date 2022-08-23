import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    alias: {
      '@frinx/workflow-ui': '/src/index-test.tsx',
      '@frinx/uniresource-ui': '/src/index-test.tsx',
      '@frinx/inventory-client': '/src/index-test.tsx',
      '@frinx/workflow-builder': '/src/index-test.tsx',
      '@frinx/frinx-gamma': '/src/index-test.tsx',
    },
  },
  resolve: {},
});
