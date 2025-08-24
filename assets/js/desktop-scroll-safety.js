
/* Desktop scroll safety net:
   Clears leftover mobile-nav class that can lock the page scroll on desktop.
   Include after your main navbar JS.
*/
(function () {
  function clearLock() {
    if (window.innerWidth >= 992 && document.body.classList.contains('mobile-nav-active')) {
      document.body.classList.remove('mobile-nav-active');
    }
  }
  window.addEventListener('resize', clearLock, { passive: true });
  document.addEventListener('DOMContentLoaded', clearLock);
  document.addEventListener('navbar:loaded', clearLock);
})();
