function isElementOutOfViewport(el) {
	const rect = el.getBoundingClientRect();
	return (
		rect.bottom < 120
	);
}

function stickyFootBuyButton_Stick(stickyFooter){
	let lastScrollTop = 0;

	window.addEventListener('scroll', function() {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const inlineButtons = document.querySelector('.product__info-wrapper .product-form__buttons .product-form__submit');		
		const isScrollingDown = scrollTop > lastScrollTop;
		//const isScrollingDownRect = inlineButtons.getBoundingClientRect();

		//if (isElementOutOfViewport(inlineButtons) && isScrollingDown) {
		if (isElementOutOfViewport(inlineButtons)) {
			stickyFooter.classList.add("stick");
		} else {
			stickyFooter.classList.remove("stick");
		}

		lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
	}, false);
}

function stickyFooterBuyButton_Content(stickyFooter){
	const ratings = document.querySelector('.product__title + .shopify-app-block').cloneNode( true );
	const ratingsContainer = stickyFooter.querySelector('.product-rating');

	ratingsContainer.appendChild(ratings);
}

function removeOnAddToCart() {
	const addToCart = document.querySelectorAll('button.product-form__submit')
  
	addToCart.forEach( (btn) => {
		btn.addEventListener('click', function(e){
			const stickyFooter = document.getElementById('product-sticky-footer-buy-button').classList.add('hidden');
		});
	})
  }

document.addEventListener('DOMContentLoaded', function(){
	const stickyFooter = document.getElementById('product-sticky-footer-buy-button');

	stickyFootBuyButton_Stick(stickyFooter);
	stickyFooterBuyButton_Content(stickyFooter);
	removeOnAddToCart();
});