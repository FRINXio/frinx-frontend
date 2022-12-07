import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    supportFile: false,
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
