(function() {
  function initializePdpTabs(root) {
    if (!root || root.dataset.tabsInitialized === 'true') return;

    const buttons = root.querySelectorAll('.tab-button');
    const panels = root.querySelectorAll('.tab-content');
    const headings = root.querySelectorAll('.content-heading');
    if (!buttons.length || !panels.length) return;

    function syncMobileAria() {
      headings.forEach((item) => {
        const itemPanel = item.closest('.tab-content');
        item.setAttribute(
          'aria-expanded',
          itemPanel && itemPanel.classList.contains('mobile-open') ? 'true' : 'false'
        );
      });
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');

        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle('active', active);
          item.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        const isDesktop = window.matchMedia('(min-width: 750px)').matches;
        panels.forEach((panel) => {
          const isActive = panel.getAttribute('data-panel') === tabId;
          panel.classList.toggle('active', isActive);
          if (isDesktop) {
            panel.classList.toggle('mobile-open', isActive);
          }
        });
        syncMobileAria();
      });
    });

    headings.forEach((heading) => {
      const panel = heading.closest('.tab-content');
      if (!panel) return;

      const togglePanel = () => {
        if (window.matchMedia('(min-width: 768px)').matches) return;
        panel.classList.toggle('mobile-open');
        syncMobileAria();
      };

      heading.addEventListener('click', togglePanel);
      heading.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          togglePanel();
        }
      });
    });

    syncMobileAria();

    root.dataset.tabsInitialized = 'true';
  }

  function initializeAllPdpTabs() {
    document.querySelectorAll('.evenflo-pdp-tabs').forEach(initializePdpTabs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllPdpTabs);
  } else {
    initializeAllPdpTabs();
  }

  document.addEventListener('shopify:section:load', initializeAllPdpTabs);
})();
