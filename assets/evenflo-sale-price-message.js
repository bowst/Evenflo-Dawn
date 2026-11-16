/*
 * Shows or hides the final-price message when the selected variant changes.
 *
 * The message is rendered by snippets/evenflo-sale-price-message.liquid.
 * product-info.js does not refresh .product__tax, so this listens for the
 * same variantChange event the oversize notice uses and compares the
 * selected variant's compare_at_price to its price.
 */
(function () {
  if (window.evenfloSalePriceMessageReady) return;
  window.evenfloSalePriceMessageReady = true;

  function isMarkedDown(variant) {
    if (!variant) return false;
    var compareAt = Number(variant.compare_at_price);
    var price = Number(variant.price);
    return compareAt > price;
  }

  function init() {
    if (typeof subscribe !== 'function' || typeof PUB_SUB_EVENTS === 'undefined') return;

    subscribe(PUB_SUB_EVENTS.variantChange, function (event) {
      var data = event && event.data;
      if (!data || !data.sectionId) return;

      var message = document.getElementById('SalePriceMessage-' + data.sectionId);
      if (!message) return;

      message.classList.toggle('hidden', !isMarkedDown(data.variant));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
