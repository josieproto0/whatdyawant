// assets/js/mobile-sidebar.js
// Mobile sidebar toggle with overlay, body scroll lock, ARIA updates, and focus trapping.
//
// Place this file at: assets/js/mobile-sidebar.js
// Include in your base layout (e.g., before </body>):
//   <script src="/assets/js/mobile-sidebar.js" defer></script>
//
// Expectations about markup:
// - Sidebar element: <aside class="sidebar" id="sidebar" aria-hidden="true" role="navigation">...</aside>
// - Mobile menu button: <button class="mobile-menu-btn" aria-controls="sidebar" aria-expanded="false" aria-label="Open menu">...</button>
// - Nav links inside sidebar should be focusable (a, button, input, etc.)
//
// The script will create a .sidebar-overlay element automatically if one doesn't exist.

(function () {
  // Utility: selector of focusable elements
  const FOCUSABLE_SELECTORS = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])'
  ].join(',');

  function qs(selector, root = document) { return root.querySelector(selector); }
  function qsa(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }

  document.addEventListener('DOMContentLoaded', () => {
    const sidebar = qs('.sidebar');
    const menuBtn = qs('.mobile-menu-btn');

    if (!sidebar || !menuBtn) {
      // Nothing to wire up
      return;
    }

    // Ensure sidebar has an id and aria-hidden initial state
    if (!sidebar.id) sidebar.id = 'sidebar';
    if (!sidebar.hasAttribute('aria-hidden')) sidebar.setAttribute('aria-hidden', 'true');

    // Ensure menu button aria-controls points to the sidebar id
    menuBtn.setAttribute('aria-controls', sidebar.id);
    if (!menuBtn.hasAttribute('aria-expanded')) menuBtn.setAttribute('aria-expanded', 'false');

    // Add or reuse overlay
    let overlay = qs('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }

    let lastFocusedElement = null;
    let isOpen = false;

    function getFocusableInSidebar() {
      return qsa(FOCUSABLE_SELECTORS, sidebar).filter(el => el.offsetParent !== null);
    }

    // Basic focus trap that cycles within the sidebar
    function trapFocus(e) {
      if (!isOpen) return;
      if (e.key !== 'Tab') return;

      const focusable = getFocusableInSidebar();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (active === first || active === sidebar) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    function openSidebar() {
      if (isOpen) return;
      isOpen = true;
      lastFocusedElement = document.activeElement;

      sidebar.classList.add('active');
      overlay.classList.add('active');
      document.body.classList.add('lock-scroll');

      sidebar.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.classList.add('active');

      // Focus first focusable element inside sidebar (or sidebar itself)
      const focusable = getFocusableInSidebar();
      if (focusable.length) focusable[0].focus();
      else sidebar.setAttribute('tabindex', '-1') && sidebar.focus();

      // Add listeners for focus trap & escape
      document.addEventListener('keydown', onKeyDown, true);
      document.addEventListener('focus', enforceFocus, true);
    }

    function closeSidebar() {
      if (!isOpen) return;
      isOpen = false;

      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('lock-scroll');

      sidebar.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.classList.remove('active');

      // restore focus to the last focused element (menu button preferred)
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      } else {
        menuBtn.focus();
      }

      // Remove listeners
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focus', enforceFocus, true);
    }

    function onKeyDown(e) {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSidebar();
        return;
      }
      // Focus trap handling
      trapFocus(e);
    }

    // Ensure focus never leaves sidebar while open (defensive)
    function enforceFocus(e) {
      if (!isOpen) return;
      if (!sidebar.contains(e.target)) {
        e.stopPropagation();
        const focusable = getFocusableInSidebar();
        if (focusable.length) focusable[0].focus();
        else sidebar.focus();
      }
    }

    // Toggle handler
    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isOpen) closeSidebar();
      else openSidebar();
    });

    // Click overlay to close
    overlay.addEventListener('click', (e) => {
      closeSidebar();
    });

    // Close when a nav link inside sidebar is clicked (helpful mobile UX)
    sidebar.addEventListener('click', (e) => {
      const link = e.target.closest('a[href], button');
      if (!link) return;
      // If link points to "#" or is a toggler, don't auto-close
      if (link.getAttribute('href') === '#' || link.dataset.keepOpen === 'true') return;
      // On small screens, auto-close after selection
      if (window.innerWidth <= 768) {
        // slight delay to allow navigation events to register
        setTimeout(() => closeSidebar(), 50);
      }
    });

    // Optional: close sidebar on orientation change for safety
    window.addEventListener('orientationchange', () => {
      if (window.innerWidth > 768 && isOpen) {
        closeSidebar();
      }
    });

    // Expose a minimal API in case you want to toggle programmatically
    window.__whatdyawant_sidebar = {
      open: openSidebar,
      close: closeSidebar,
      toggle: () => (isOpen ? closeSidebar() : openSidebar()),
      isOpen: () => isOpen
    };
  });
})();
