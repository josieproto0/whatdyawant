// assets/js/mobile-bottom-menu.js
// Creates a bottom-pinned mobile nav by cloning the sidebar nav links.
// Place at: assets/js/mobile-bottom-menu.js
// Include in your base layout (before </body>): <script src="/assets/js/mobile-bottom-menu.js" defer></script>

(function () {
  function qs(selector, root = document) { return root.querySelector(selector); }
  function qsa(selector, root = document) { return Array.from((root || document).querySelectorAll(selector)); }

  document.addEventListener('DOMContentLoaded', function () {
    const sidebarNav = qs('.sidebar .sidebar-nav');
    if (!sidebarNav) return;

    // Build bottom nav container
    const bottomNav = document.createElement('nav');
    bottomNav.className = 'mobile-bottom-nav';
    bottomNav.setAttribute('role', 'navigation');
    bottomNav.setAttribute('aria-label', 'Primary');

    const inner = document.createElement('div');
    inner.className = 'mobile-bottom-nav-inner';

    // Clone nav items, preserving href and icon/text if present
    const items = qsa('a.nav-item, .sidebar-nav > a, .sidebar-nav > button, .sidebar-nav > li > a', sidebarNav);
    if (items.length === 0) {
      // fallback: try any links inside sidebarNav
      const fallback = qsa('a', sidebarNav);
      fallback.forEach(a => items.push(a));
    }

    items.forEach((el, idx) => {
      const link = document.createElement('a');
      // copy href or create a button if no href
      if (el.tagName.toLowerCase() === 'a' && el.getAttribute('href')) {
        link.setAttribute('href', el.getAttribute('href'));
      } else {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
      }
      link.className = 'mobile-bottom-item';
      // copy inner icon + label (prefer .icon and .label if present)
      const icon = el.querySelector('.icon') || el.querySelector('span') || null;
      const label = el.querySelector('.label') || el.querySelector('span:last-child') || null;

      // helper to clone node safely
      function cloneNodeText(node) {
        if (!node) return null;
        const c = node.cloneNode(true);
        // strip event attributes that may cause inline JS issues
        c.removeAttribute('onclick');
        return c;
      }

      const iconClone = cloneNodeText(icon);
      const labelClone = cloneNodeText(label);

      if (iconClone) {
        iconClone.classList.add('mobile-bottom-icon');
        link.appendChild(iconClone);
      }

      if (labelClone) {
        const lbl = document.createElement('span');
        lbl.className = 'mobile-bottom-label';
        // For cases where the labelClone is a span, use its textContent
        lbl.textContent = labelClone.textContent.trim();
        link.appendChild(lbl);
      } else {
        // fallback to textContent (trim)
        const text = (el.textContent || '').trim();
        if (text) {
          const lbl = document.createElement('span');
          lbl.className = 'mobile-bottom-label';
          lbl.textContent = text;
          link.appendChild(lbl);
        }
      }

      // mark active state if href matches current location
      const href = link.getAttribute('href');
      if (href && (location.pathname.endsWith(href) || location.pathname === href || location.pathname === '/' + href)) {
        link.classList.add('active');
      } else if (href && location.href.includes(href) && href !== '#') {
        // For relative paths with query params etc.
        link.classList.add('active');
      }

      inner.appendChild(link);
    });

    // If there were no items, abort
    if (!inner.children.length) return;

    bottomNav.appendChild(inner);
    document.body.appendChild(bottomNav);

    // Make sure body has padding-bottom to avoid content being covered on mobile
    function updateBodyPadding() {
      const navHeight = bottomNav.offsetHeight || 64;
      // Only add padding on small screens (same breakpoint as CSS)
      if (window.innerWidth <= 768) {
        document.documentElement.style.setProperty('--mobile-bottom-nav-height', navHeight + 'px');
        document.body.style.paddingBottom = navHeight + 'px';
      } else {
        document.documentElement.style.removeProperty('--mobile-bottom-nav-height');
        document.body.style.paddingBottom = '';
      }
    }

    // Ensure active class updates on navigation (basic)
    document.addEventListener('click', function (e) {
      const a = e.target.closest('.mobile-bottom-item');
      if (!a) return;
      // highlight active item
      qsa('.mobile-bottom-item').forEach(i => i.classList.remove('active'));
      a.classList.add('active');
    });

    // On resize/orientation change recalc padding
    window.addEventListener('resize', updateBodyPadding);
    window.addEventListener('orientationchange', updateBodyPadding);

    // initial
    updateBodyPadding();

    // Allow keyboard activation for role=button items
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target && target.classList && target.classList.contains('mobile-bottom-item') && !target.hasAttribute('href')) {
          e.preventDefault();
          target.click();
        }
      }
    });
  });
})();
