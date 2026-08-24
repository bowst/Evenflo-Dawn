function initializeSwatchToggles() {
	var swatchLinks = document.querySelectorAll('.color-swatches a');
	if (!swatchLinks.length) return;

	function toggleSwatches(e) {
		e.preventDefault();
		var targetSwatch = e.currentTarget;

		if (targetSwatch.classList.contains('active')) return;

		var productCard = targetSwatch.closest('.product-card-wrapper');
		if (!productCard) return;

		var activeSwatch = productCard.querySelector('.color-swatches a.active');
		var targetHref = targetSwatch.getAttribute('href');
		var targetImage = targetHref ? productCard.querySelector(targetHref) : null;
		var activeImage = activeSwatch && activeSwatch.getAttribute('href')
			? productCard.querySelector(activeSwatch.getAttribute('href'))
			: null;
		var variantTitle = productCard.querySelector('.variant-title');
		var activeVariantID = targetSwatch.getAttribute('data-variant-id');
		var productLinks = productCard.querySelectorAll('.product-link');

		// Swatches expect imgs with id="vid_{variant.id}". Bail if markup is missing.
		if (!targetImage) return;

		if (activeImage) activeImage.classList.remove('active');
		if (activeSwatch) activeSwatch.classList.remove('active');

		targetImage.classList.add('active');
		targetSwatch.classList.add('active');

		if (variantTitle) {
			variantTitle.innerHTML = targetSwatch.getAttribute('title') || '';
		}

		var variantInput = productCard.querySelector('.product-variant-id');
		var addButton = productCard.querySelector('.quick-add__submit');
		var isOutOfStock = targetSwatch.classList.contains('out-of-stock');

		if (variantInput) {
			variantInput.value = activeVariantID;
			variantInput.disabled = isOutOfStock;
		}

		if (addButton) {
			addButton.disabled = isOutOfStock;
			var buttonText = addButton.querySelector('span:first-child');
			if (buttonText) {
				buttonText.textContent = isOutOfStock ? 'Sold out' : 'Add to cart';
			}
		}

		productLinks.forEach(function (link) {
			if (!link.getAttribute('data-product-url')) {
				var originalUrl = link.getAttribute('href') || '';
				originalUrl = originalUrl.split('?')[0];
				link.setAttribute('data-product-url', originalUrl);
			}

			link.setAttribute(
				'href',
				link.getAttribute('data-product-url') + '?variant=' + activeVariantID
			);
		});
	}

	swatchLinks.forEach(function (swatch) {
		swatch.addEventListener('click', toggleSwatches);
	});
}

document.addEventListener('DOMContentLoaded', function () {
	initializeSwatchToggles();
});
