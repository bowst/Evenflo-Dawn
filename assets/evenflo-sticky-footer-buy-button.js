function stickyFooterAtcOutOfView() {
  const inlineButtons = document.querySelector(
    '.product__info-wrapper .product-form__buttons .product-form__submit'
  );
  if (!inlineButtons) return true;
  return inlineButtons.getBoundingClientRect().bottom < 120;
}

function stickyFooterSentinelVisible(slot) {
  if (!slot) return false;
  const rect = slot.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

function stickyFootBuyButton_Stick(stickyFooter) {
  const slot = stickyFooter.closest('.product-sticky-slot');
  const isMobile = function () {
    return window.matchMedia('(max-width: 749px)').matches;
  };

  var update = function () {
    if (stickyFooter.classList.contains('hidden')) return;

    const sentinelVisible = stickyFooterSentinelVisible(slot);
    const atcOut = stickyFooterAtcOutOfView();
    const shouldStick = sentinelVisible || isMobile() || atcOut;

    if (shouldStick) {
      if (slot && !stickyFooter.classList.contains('is-stuck')) {
        slot.style.minHeight = stickyFooter.offsetHeight + 'px';
      }
      stickyFooter.classList.add('is-stuck');
    } else {
      stickyFooter.classList.remove('is-stuck');
      if (slot) slot.style.minHeight = '';
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function updateStickyVariant(stickyFooter) {
  const nameEl = stickyFooter.querySelector('[data-sticky-color-name]');
  const swatchEl = stickyFooter.querySelector('[data-sticky-swatch]');
  const selected = document.querySelector(
    '.product__info-container .product-form__input--swatch [data-selected-value] span'
  );
  if (nameEl && selected && selected.textContent) {
    nameEl.textContent = selected.textContent.trim();
  }

  const checked = document.querySelector(
    '.product__info-container .product-form__input--swatch input:checked'
  );
  if (checked && swatchEl) {
    const label = document.querySelector('label[for="' + checked.id + '"]');
    const source = label ? label.querySelector('.swatch') || label : null;
    if (source) {
      const styles = getComputedStyle(source);
      const token = styles.getPropertyValue('--swatch--background').trim();
      const image = styles.backgroundImage;
      const color = styles.backgroundColor;
      if (token) swatchEl.style.setProperty('--swatch--background', token);
      else if (image && image !== 'none') swatchEl.style.setProperty('--swatch--background', image);
      else if (color) swatchEl.style.setProperty('--swatch--background', color);
    }
  }
}

function stickyFooterContent(stickyFooter, update) {
  const stickyFooterButton = document.getElementById('sticky-footer-button');
  if (!stickyFooterButton) return;

  setTimeout(function () {
    const formBtn = document.querySelector('form .product-form__submit');
    if (formBtn) {
      stickyFooterButton.disabled = !!formBtn.disabled;
      stickyFooterButton.innerHTML = formBtn.innerHTML;
    }

    const mediaImg = document.querySelector(
      '.product-media-container modal-opener .product__media img'
    );
    const imageWrap = stickyFooter.querySelector('.product-image');
    if (mediaImg && imageWrap) {
      imageWrap.innerHTML = '';
      imageWrap.appendChild(mediaImg.cloneNode(true));
    }

    const priceContainer = document.querySelector(
      '.product__info-container .price-shipping-wrapper > .price'
    );
    const stickyPriceContainer = stickyFooter.querySelector(
      '#product-sticky-footer-buy-button .price-container, .price-container'
    );
    if (priceContainer && stickyPriceContainer) {
      stickyPriceContainer.innerHTML = '';
      stickyPriceContainer.appendChild(priceContainer.cloneNode(true));
    }

    updateStickyVariant(stickyFooter);
  }, 500);

  if (update === false) {
    const ratingsBlock = document.querySelector('.product__title + .shopify-app-block');
    const ratingsContainer = stickyFooter.querySelector('.product-rating');
    if (ratingsBlock && ratingsContainer && !ratingsContainer.childElementCount) {
      ratingsContainer.appendChild(ratingsBlock.cloneNode(true));
    }

    stickyFooterButton.addEventListener('click', function () {
      const submit = document.querySelector(
        'form .product-form__buttons .product-form__submit'
      );
      if (submit) submit.click();
    });
  }
}

function removeOnAddToCart() {
  document.querySelectorAll('button.product-form__submit').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const bar = document.getElementById('product-sticky-footer-buy-button');
      if (bar) bar.classList.add('hidden');
    });
  });
}

function updateContentVariantChange(stickyFooter) {
  const variantID = document.querySelector('.product__info-container .product-variant-id');
  if (variantID) {
    variantID.addEventListener('change', function () {
      stickyFooterContent(stickyFooter, true);
    });
  }
  if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
    subscribe(PUB_SUB_EVENTS.variantChange, function () {
      stickyFooterContent(stickyFooter, true);
    });
  }
}

function dockStickyFooterInAtAGlance(stickyFooter) {
  const aag = document.querySelector('.aag-section');
  if (!aag || !stickyFooter) return;

  const band = document.createElement('div');
  band.className = 'aag-band';
  const slot = document.createElement('div');
  slot.className = 'product-sticky-slot';

  aag.parentNode.insertBefore(band, aag);
  band.appendChild(slot);
  slot.appendChild(stickyFooter);
  band.appendChild(aag);
  band.style.backgroundColor = getComputedStyle(aag).backgroundColor || '#faf8f6';
  stickyFooter.classList.add('product-sticky-buttons--in-band');
}

document.addEventListener('DOMContentLoaded', function () {
  const stickyFooter = document.getElementById('product-sticky-footer-buy-button');
  if (!stickyFooter) return;
  dockStickyFooterInAtAGlance(stickyFooter);
  updateContentVariantChange(stickyFooter);
  stickyFootBuyButton_Stick(stickyFooter);
  stickyFooterContent(stickyFooter, false);
  removeOnAddToCart();
});
