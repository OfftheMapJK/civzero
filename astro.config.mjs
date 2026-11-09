import { defineConfig } from 'astro/config';

// Pages à plat (f-xxx.html) et styles intégrés à chaque page : le site s'ouvre aussi bien
// sur la station, sur GitHub Pages (sous-dossier) que depuis une clé, sans chemin absolu.
export default defineConfig({
  build: { format: 'file', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
