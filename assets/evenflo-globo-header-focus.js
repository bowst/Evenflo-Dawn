/**
 * Globo bottom-bar Menu/Cart clicks the real header controls, which
 * programmatically focuses them. iOS treats that first .focus() as
 * :focus-visible. Mark those opens so CSS can hide the ring on the
 * header icons only — keyboard focus styles stay intact.
 */
(function () {
  var CLASS_NAME = 'evenflo-globo-header-focus';
  var HEADER_ICON_SELECTOR = '.header__icon--menu, #cart-icon-bubble';

  function isGloboMenuOrCartTrigger(target) {
    var link = target && target.closest ? target.closest('a[href^="gm-open:"]') : null;
    if (!link) return false;
    var href = (link.getAttribute('href') || '').toLowerCase();
    return href.indexOf('mobilemenu') !== -1 || href.indexOf('cart') !== -1;
  }

  function markGloboHeaderOpen(event) {
    if (!isGloboMenuOrCartTrigger(event.target)) return;
    document.body.classList.add(CLASS_NAME);
  }

  document.addEventListener('pointerdown', markGloboHeaderOpen, true);
  document.addEventListener('click', markGloboHeaderOpen, true);

  document.addEventListener(
    'focusout',
    function (event) {
      if (!document.body.classList.contains(CLASS_NAME)) return;
      var icon = event.target && event.target.closest ? event.target.closest(HEADER_ICON_SELECTOR) : null;
      if (!icon) return;
      if (event.relatedTarget && icon.contains(event.relatedTarget)) return;
      document.body.classList.remove(CLASS_NAME);
    },
    true
  );
})();
