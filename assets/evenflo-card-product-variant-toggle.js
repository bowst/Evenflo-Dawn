function initializeSwatchToggles() {
	if(document.querySelectorAll('.color-swatches a')){
		var swatchLinks = document.querySelectorAll('.color-swatches a');

		function toggleSwatches(e){

			e.preventDefault();
			var targetSwatch = e.currentTarget;
			
			if( ! targetSwatch.classList.contains('active') ){
			var productCard = targetSwatch.closest('.product-card-wrapper');
			var variantImages = productCard.querySelectorAll('.variant-images .img');
			var activeSwatch = productCard.querySelector('.color-swatches a.active');
			var activeImage = productCard.querySelector( activeSwatch.getAttribute('href') );
			var targetImage = productCard.querySelector( targetSwatch.getAttribute('href') );
			var variantTitle = productCard.querySelector( '.variant-title' );

			activeImage.classList.remove('active');
			activeSwatch.classList.remove('active');

			targetImage.classList.add('active');
			targetSwatch.classList.add('active');

			variantTitle.innerHTML = targetSwatch.getAttribute('title');
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