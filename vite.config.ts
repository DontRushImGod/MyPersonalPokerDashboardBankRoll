import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Strip crossorigin attributes from script/link tags in the built HTML.
// Netlify's CDN doesn't return Access-Control-Allow-Origin for same-origin
// static assets, so <script crossorigin> silently fails to execute.
function stripCrossorigin() {
  return {
    name: 'strip-crossorigin',
    transformIndexHtml(html: string) {
      return html.replace(/\s+crossorigin(?=["'\s>])/g, '');
    },
  };
}

export default defineConfig({
  plugins: [react(), stripCrossorigin()],
  base: './',
});
