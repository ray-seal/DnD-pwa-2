// Place this file and include it near the end of  (or import it) in your index.html

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log('ServiceWorker registered:', reg.scope);
      })
      .catch(err => {
        console.warn('ServiceWorker registration failed:', err);
      });
  });
}
