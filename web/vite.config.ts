import { defineConfig } from 'vitest/config';

function basePath(): string {
  const raw = process.env.WEB_BASE_PATH || '/';
  const withLead = raw.startsWith('/') ? raw : `/${raw}`;
  return withLead.endsWith('/') ? withLead : `${withLead}/`;
}

export default defineConfig({
  base: basePath(),
  build: {
    // The bundled Plotly library is large. It loads on demand, only on the Demos page.
    chunkSizeWarningLimit: 5000,
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
