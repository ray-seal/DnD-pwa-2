# PWA Setup and Configuration Guide

## Overview

This repository now includes Progressive Web App (PWA) support with enhanced offline capabilities and installability features.

## New Files Added

### PWA Core Files
- **manifest.webmanifest** - PWA manifest with app metadata and icon references
- **service-worker.js** - Enhanced service worker with offline fallback support
- **sw-register.js** - Service worker registration script
- **offline.html** - Offline fallback page shown when network is unavailable

### Configuration Files
- **vercel.json** - Vercel deployment configuration with proper headers for PWA
- **INDEX-PWA-SNIPPET.html** - HTML snippet to integrate PWA features into your index.html

### Assets
- **/icons/** directory - Contains all app icons (copied from root)
  - icon-192.png
  - icon-192.svg
  - icon-512.png
  - icon-512.svg
  - icon.svg

## Integration Steps

### 1. Update Your index.html

Add the PWA meta tags and references to your `<head>` section. See `INDEX-PWA-SNIPPET.html` for the exact code to add.

Key additions:
```html
<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.webmanifest">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" href="/icons/icon-192.png">
```

Add before closing `</body>`:
```html
<!-- Service Worker Registration -->
<script src="/sw-register.js"></script>
```

### 2. Test Locally

To test PWA features locally, you need to serve the app over HTTPS or localhost:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

Then open: http://localhost:8080

### 3. Verify Service Worker

1. Open browser DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Check "Service Workers" section
4. You should see service-worker.js registered

### 4. Test Offline Mode

1. In DevTools, go to Network tab
2. Check "Offline" checkbox
3. Refresh the page
4. You should see the offline.html fallback page

### 5. Test Installation

**Desktop (Chrome/Edge):**
- Look for install icon in address bar
- Click to install the PWA

**Mobile (iOS Safari):**
- Tap Share button
- Select "Add to Home Screen"

**Mobile (Android Chrome):**
- Tap menu (⋮)
- Select "Add to Home screen" or "Install app"

## Deployment

### Vercel Deployment

The included `vercel.json` configures:
- Proper caching headers for service worker
- Correct MIME types for manifest files
- Static file serving

Deploy with:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Hosting Platforms

For GitHub Pages, Netlify, or other hosts:
1. Ensure all files are served over HTTPS
2. Configure proper MIME types for .webmanifest files
3. Set Cache-Control headers for service-worker.js to prevent caching

## Service Worker Caching Strategy

The service worker uses a hybrid caching strategy:

- **Navigation requests**: Network-first with cache fallback and offline page
- **Assets (CSS, JS, images)**: Cache-first with network fallback
- **Same-origin only**: External resources are not cached to avoid CORS issues

## Updating the App

When you update your app:

1. Update the CACHE_NAME in service-worker.js (e.g., 'dnd-pwa-v2')
2. Add new critical assets to PRECACHE_URLS
3. Deploy changes
4. Service worker will automatically update on next visit

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure you're serving over HTTPS or localhost
- Clear browser cache and try again

### Offline Mode Not Working
- Verify offline.html is accessible
- Check service worker is active in DevTools
- Ensure PRECACHE_URLS includes all critical files

### Icons Not Showing
- Verify /icons/ directory exists and contains icon files
- Check manifest.webmanifest paths are correct
- Clear cache and reinstall PWA

### Updates Not Appearing
- Service workers cache aggressively
- Update CACHE_NAME to force cache invalidation
- Use "Update on reload" in DevTools during development

## Icon Guidelines

### Trademark Notice
⚠️ **IMPORTANT**: The icons in this repository may contain or be derivatives of trademarked logos. Before deploying to production:

1. Review all icon files in /icons/ directory
2. Ensure you have proper rights to use any trademarked imagery
3. Consider replacing with original artwork or licensed assets
4. Consult with legal counsel if using for commercial purposes

### Creating Custom Icons

To replace with custom icons:

1. Create PNG files at required sizes:
   - 192x192 pixels (icon-192.png)
   - 512x512 pixels (icon-512.png)
2. Place in /icons/ directory
3. Update manifest.webmanifest if changing filenames
4. Recommended: Also create SVG version for scalability

Tools for icon creation:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Figma](https://figma.com) or [Inkscape](https://inkscape.org) for design

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Manifest | ✅ | ✅ | ⚠️ | ✅ |
| Install Prompt | ✅ | ❌ | ⚠️ | ✅ |
| Offline Support | ✅ | ✅ | ✅ | ✅ |

⚠️ = Partial support or requires user action

## Additional Resources

- [PWA Documentation (MDN)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Workbox (Advanced SW Library)](https://developers.google.com/web/tools/workbox)

## License & Credits

PWA implementation follows standard web practices. Original D&D content and trademarks belong to Wizards of the Coast LLC.
