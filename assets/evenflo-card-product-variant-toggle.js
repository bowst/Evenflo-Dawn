function initializeSwatchToggles() {
	if(document.querySelectorAll('.color-swatches a')){
		var swatchLinks = document.querySelectorAll('.color-swatches a');

		function toggleSwatches(e){

			e.preventDefault();
			var targetSwatch = e.currentTarget;
			
			if( ! targetSwatch.classList.contains('active') ){
				var productCard = targetSwatch.closest('.product-card-wrapper');
				var productLinks = productCard.querySelectorAll('.product-link');
				var activeSwatch = productCard.querySelector('.color-swatches a.active');
				var activeVariantID = targetSwatch.getAttribute('data-variant-id');
				var activeImage = productCard.querySelector( activeSwatch.getAttribute('href') );
				var targetImage = productCard.querySelector( targetSwatch.getAttribute('href') );
				var variantTitle = productCard.querySelector( '.variant-title' );

				activeImage.classList.remove('active');
				activeSwatch.classList.remove('active');

				targetImage.classList.add('active');
				targetSwatch.classList.add('active');

				variantTitle.innerHTML = targetSwatch.getAttribute('title');

				
				productLinks.forEach((link) => {
					// Store the original URL without variant parameters if not already stored
					if(! link.getAttribute('data-product-url')){
						var originalUrl = link.getAttribute('href');
						// Remove any existing variant parameter
						originalUrl = originalUrl.split('?')[0];
						link.setAttribute('data-product-url', originalUrl);
					}
					
					// Set the href to the clean URL with the new variant
					link.setAttribute('href', link.getAttribute('data-product-url') + '?variant=' + activeVariantID);
				});
			}
		}

		swatchLinks.forEach((swatch) => {
			swatch.addEventListener('click', toggleSwatches);
		});
	}
}

document.addEventListener('DOMContentLoaded', function() {
  initializeSwatchToggles();
});