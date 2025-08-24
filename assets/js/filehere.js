/* Navbar loader - drops a single master navbar into every page.
 * Place this file at /assets/js/filehere.js
 * It loads /partials/navbar.html and auto-highlights the current page.
 */
(() => {
  "use strict";

  const NAV_SRC = "/partials/navbar.html?v=1"; // bump v to bust cache after edits
  const SLOT_ID = "navbar-slot";

  const normalize = (p) => p.replace(/\/index\.html$/i, "/");

  function ensureSlot() {
    let slot = document.getElementById(SLOT_ID);
    if (slot) return slot;

    // Prefer inserting inside #header if present, otherwise at the top of <body>
    const host = document.querySelector("#header") || document.body;
    slot = document.createElement("div");
    slot.id = SLOT_ID;
    if (host.firstChild) host.insertBefore(slot, host.firstChild);
    else host.appendChild(slot);
    return slot;
  }

  async function injectNavbar() {
    const slot = ensureSlot();
    const src = slot.getAttribute("data-nav-src") || NAV_SRC;

    try {
      const res = await fetch(src, { cache: "no-store" });
      if (!res.ok) throw new Error(res.status + " " + res.statusText);
      const html = await res.text();

      // Replace the placeholder with the fetched markup to avoid extra wrapper divs
      slot.outerHTML = html;

      // Auto-highlight current page + parent dropdown
      const nav = document.getElementById("navbar");
      if (nav) {
        const current = normalize(location.pathname);
        let match = null;

        nav.querySelectorAll("a[href]").forEach((a) => {
          const href = a.getAttribute("href") || "";
          try {
            const url = new URL(href, location.origin);
            if (normalize(url.pathname) === current) match = a;
          } catch {
            if (!match && current.endsWith(href)) match = a;
          }
        });

        if (match) {
          match.classList.add("active");
          match.setAttribute("aria-current", "page");
          const dd = match.closest("li.dropdown");
          dd?.querySelector(":scope > a")?.classList.add("active");
        }
      }

      // Signal completion (handy if your theme needs re-binding)
      document.dispatchEvent(new Event("navbar:loaded"));
    } catch (err) {
      console.error("Failed to load navbar:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectNavbar);
  } else {
    injectNavbar();
  }
})();
