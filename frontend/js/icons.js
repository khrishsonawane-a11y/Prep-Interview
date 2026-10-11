/**
 * AI Interview Preparation System — Production Lucide Icons Initializer
 * Automatically converts all <i data-lucide="..."></i> elements into crisp SVGs
 * and watches for dynamic DOM insertions across all interview stages.
 */

(function() {
  function renderAllIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // Render on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAllIcons);
  } else {
    renderAllIcons();
  }

  // Expose global helper for manual re-rendering after AJAX/state changes
  window.renderIcons = renderAllIcons;

  // MutationObserver to automatically render icons in dynamically injected elements
  let debounceTimer = null;
  const observer = new MutationObserver((mutations) => {
    let hasNewIcon = false;
    for (const m of mutations) {
      if (m.type === 'childList') {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1) {
            if (node.hasAttribute('data-lucide') || node.querySelector?.('[data-lucide]')) {
              hasNewIcon = true;
              break;
            }
          }
        }
      }
      if (hasNewIcon) break;
    }

    if (hasNewIcon) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(renderAllIcons, 16);
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
})();
