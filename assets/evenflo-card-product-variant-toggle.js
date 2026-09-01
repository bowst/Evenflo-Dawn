function initializeSwatchToggles() {
	if (window.__evenfloSwatchTogglesBound) return;
	window.__evenfloSwatchTogglesBound = true;

	var swatchLinks = document.querySelectorAll('.color-swatches a');
	if (!swatchLinks.length) return;

	function toggleSwatches(e) {
		e.preventDefault();
		var targetSwatch = e.currentTarget;

		if (targetSwatch.classList.contains('active')) return;

		var productCard = targetSwatch.closest('.product-card-wrapper');
		if (!productCard) return;

		var productLinks = productCard.querySelectorAll('.product-link');
		var activeSwatch = productCard.querySelector('.color-swatches a.active');
		var activeVariantID = targetSwatch.getAttribute('data-variant-id');
		var targetImage = productCard.querySelector(targetSwatch.getAttribute('href'));
		var variantTitle = productCard.querySelector('.variant-title');

		if (activeSwatch) {
			var activeImage = productCard.querySelector(activeSwatch.getAttribute('href'));
			if (activeImage) activeImage.classList.remove('active');
			activeSwatch.classList.remove('active');
		}

		if (targetImage) targetImage.classList.add('active');
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

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeSwatchToggles);
} else {
	initializeSwatchToggles();
}
