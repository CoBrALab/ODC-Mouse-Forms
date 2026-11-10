import { defineConfig } from 'vite';


export default defineConfig({
  base: process.env.VITE_BASENAME ?? '/',
  // The forms live in lib/forms because that is where Open Data Capture's repository
  // sync looks for them. Serving lib as the public directory keeps them published at
  // /forms/<name>/index.ts, the same URLs they had under public/.
  publicDir: 'lib'
});
