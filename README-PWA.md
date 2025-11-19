# PWA setup (DnD-pwa-2)

This repo now includes the minimal files needed to function as a Progressive Web App and be deployed on Vercel.

Files added:
- `manifest.webmanifest` — app manifest
- `service-worker.js` — service worker (root)
- `sw-register.js` — registers the service worker
- `offline.html` — offline fallback page
- `vercel.json` — headers for serving the service worker correctly

Steps to finish setup
1. Icons
   - Create an `icons` folder at the repository root and add:
     - `icons/icon-192.png` (192x192)
     - `icons/icon-512.png` (512x512)
   - You can generate icons using tools like https://realfavicongenerator.net/ or any image editor.

2. Merge registration into index.html
   - In your existing `index.html` add in the <head>:
     ```html
     <link rel="manifest" href="/manifest.webmanifest">
     <meta name="theme-color" content="#2b2b2b">
     <meta name="mobile-web-app-capable" content="yes">
     <link rel="icon" href="/icons/icon-192.png">
     ```
   - At the end of the <body> (before </body>), include:
     ```html
     <script src="/sw-register.js"></script>
     ```
   - If you already have a main JS bundle, you can import or inline the registration code.

3. Test locally
   - Service Workers require HTTPS, but `localhost` works for development.
   - Install a simple static server (if needed):
     - `npm install -g serve`
     - `serve -s .` (from repo root)
   - Open http://localhost:3000 (or the port displayed) and check DevTools > Application > Service Workers.

4. Deploy on Vercel
   - Connect this GitHub repo in the Vercel dashboard and deploy.
   - Alternatively, run `vercel` from CLI and follow prompts.
   - Vercel will serve the files at the root so `/service-worker.js` will be reachable.

Notes / Troubleshooting
- Keep `service-worker.js` at repository root so it's served from '/service-worker.js' and controls the entire scope.
- Update `PRECACHE_URLS` in `service-worker.js` to include the exact paths of your main CSS/JS files (e.g., `/css/styles.css`, `/js/app.js`) for offline caching.
- When updating the service worker, bump `CACHE_NAME` to force clients to refresh cached assets.
