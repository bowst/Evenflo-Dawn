function stickyFootBuyButton_Stick(stickyFooter){
	let lastScrollTop = 0; // Initialize a variable to store the last scroll position.

	window.addEventListener('scroll', function() {
		let currentScroll = window.scrollY || document.documentElement.scrollTop; // Get current scroll position.

		if (currentScroll > lastScrollTop) {
			// Scrolling down.
			stickyFooter.classList.add("stick");
		} else {
		// Scrolling up.
		stickyFooter.classList.remove("stick");
		}
		lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Update the lastScrollTop.
	}, false);
}

function stickyFooterBuyButton_Content(stickyFooter){
	const ratings = document.querySelector('.product__title + .shopify-app-block').cloneNode( true );
	const ratingsContainer = stickyFooter.querySelector('.product-rating');

	ratingsContainer.appendChild(ratings);
}
document.addEventListener('DOMContentLoaded', function(){
	const stickyFooter = document.getElementById('product-sticky-footer-buy-button');

	stickyFootBuyButton_Stick(stickyFooter);
	stickyFooterBuyButton_Content(stickyFooter);
});