/*
 * Keeps the oversize package fee notice in sync when the customer changes variant.
 *
 * The notice itself is rendered in Liquid by snippets/evenflo-oversize-notice.liquid,
 * so all of the business rules (threshold, fee amount, price banding, message text)
 * live in one place and stay driven by the shop metafields.
 *
 * It sits inside .product__tax, which is NOT one of the element ids that
 * product-info.js refreshes automatically (it only swaps price, Sku, Inventory,
 * Volume and Price-Per-Item). We therefore listen for the theme's own
 * variantChange event, which carries the freshly rendered section markup, and
 * copy the newly rendered notice across. This reuses the existing variant-change
 * mechanism rather than introducing a second one.
 */
(function () {
  function init() {
    // subscribe/PUB_SUB_EVENTS come from global pubsub.js + constants.js.
    if (typeof subscribe !== 'function' || typeof PUB_SUB_EVENTS === 'undefined') return;

    subscribe(PUB_SUB_EVENTS.variantChange, function (event) {
      var sectionId = event.data.sectionId;
      var html = event.data.html;
      if (!sectionId || !html) return;

      // The section is re-rendered server side, so the incoming markup already
      // reflects the correct carton size for the newly selected variant.
      var incoming = html.getElementById('OversizeNotice-' + sectionId);
      var current = document.getElementById('OversizeNotice-' + sectionId);

      if (incoming && current) {
        // Both present: the notice still applies, but the wording may have
        // changed (e.g. crossing the free shipping threshold).
        current.innerHTML = incoming.innerHTML;
        return;
      }

      if (!incoming && current) {
        // New variant is not oversize (or has no carton size) - remove it.
        current.remove();
        return;
      }

      if (incoming && !current) {
        // Previous variant was not oversize but this one is - add it back,
        // at the end of the shipping line so it continues that sentence.
        var shippingLine = document.querySelector(
          '#ProductInfo-' + sectionId + ' .product__tax, .product__info-container .product__tax'
        );
        if (shippingLine) shippingLine.appendChild(incoming.cloneNode(true));
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
