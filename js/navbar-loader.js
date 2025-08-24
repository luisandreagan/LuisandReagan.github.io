<script>
(() => {
  // Where the partial lives (change if you put it somewhere else)
  const NAV_SRC_DEFAULT = '/partials/navbar.html'; // bump ?v=2 after edits to bust cache
  const SLOT_ID = 'navbar-slot';

  const normalize = (p) => p.replace(/\/index\.html$/i, '/');

  async function injectNavbar() {
    const slot = document.getElementById(SLOT_ID);
    if (!slot) return;

    const src = slot.getAttribute('data-nav-src') || NAV_SRC_DEFAULT;

    try {
      const res = await fetch(src, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const html = await res.text();

      // Replace the placeholder div with the fetched <nav>…</nav>
      slot.outerHTML = html;

      // Auto-highlight current page
      const nav = document.getElementById('navbar');
      if (nav) {
        const current = normalize(location.pathname);
        let match = null;

        nav.querySelectorAll('a[href]').forEach(a => {
          const href = a.getAttribute('href') || '';
          try {
            const url = new URL(href, location.origin);
            if (normalize(url.pathname) === current) match = a;
          } catch {
            // Relative HREF fallback match
            if (!match && current.endsWith(href)) match = a;
          }
        });

        if (match) {
          match.classList.add('active');
          match.setAttribute('aria-current', 'page');
          // If link is in a dropdown, mark the parent trigger as active too
          const dd = match.closest('li.dropdown');
          dd?.querySelector(':scope > a')?.classList.add('active');
        }
      }

      // Optional: let your theme know the navbar is now present
      document.dispatchEvent(new Event('navbar:loaded'));
      // If your theme exposes a re-init function, you could call it here:
      // window.initThemeNavbar && window.initThemeNavbar();
    } catch (err) {
      console.error('Failed to load navbar:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNavbar);
  } else {
    injectNavbar();
  }
})();
</script>
