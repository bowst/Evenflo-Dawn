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

function stickyFooterContent(stickyFooter, update){
	// these items are updated on load AND on variant change
	const stickyFooterButton = document.getElementById('sticky-footer-button');
	
	setTimeout( function(){
		//Update shipping
		const shippingNotice = document.getElementById('free-shipping-notice-footer');
		let productPrice = false;

		if(document.querySelector('.product__info-container .price--on-sale')){
			//console.log('sale price');
			productPrice = document.querySelector('.product__info-container .price-item--sale').innerHTML;
		}else{
			//console.log('reg price');
			productPrice =  document.querySelector('.product__info-container .price-item--regular').innerHTML;
		}

		productPrice = productPrice.replace("$", "");
		
		//console.log(productPrice, productPrice > 150.00);
		if(productPrice > 150.00 ){
			shippingNotice.classList.remove('hidden');
			//console.log('free');

		}else{
			shippingNotice.classList.add('hidden');
		}

		// Ensure the form button content is correct
		const formBtn = document.querySelector('form .product-form__submit');

		//console.log('form button:', formBtn.disabled);
		if(formBtn.disabled){
			stickyFooterButton.disabled = true;
		}else{
			stickyFooterButton.disabled = false;
		}
		stickyFooterButton.innerHTML = formBtn.innerHTML;
		
		// these should really only need to be updated on change, but I've found a few place where, if you link to the variant, it shows the default product image etc. instead so updating on load for good measure
		
		// Update variant image
		const variantImg = document.querySelector('.product-media-container modal-opener .product__media img').cloneNode( true );

		//console.log('Image:', variantImg)
		stickyFooter.querySelector('.product-image').innerHTML = '';
		stickyFooter.querySelector('.product-image').appendChild(variantImg);

		//Update variant price
		const priceContainer = document.querySelector('.product__info-container .price-shipping-wrapper > .price').cloneNode(true);
		//console.log(priceContainer);
		const stickyPriceContainer =document.querySelector('#product-sticky-footer-buy-button .price-container');

		stickyPriceContainer.innerHTML = '';
		stickyPriceContainer.appendChild(priceContainer);
	}, 500);
	if( update === false ){
		//console.log('PAGE LOAD UPDATE');
		// these items need to be updated on load only
		const ratings = document.querySelector('.product__title + .shopify-app-block').cloneNode( true );
		const ratingsContainer = stickyFooter.querySelector('.product-rating');
		ratingsContainer.appendChild(ratings);

		stickyFooterButton.addEventListener('click', function(e){
			document.querySelector('form .product-form__buttons .product-form__submit').click();
		});
	}
}

function removeOnAddToCart() {
	const addToCart = document.querySelectorAll('button.product-form__submit')
  
	addToCart.forEach( (btn) => {
		btn.addEventListener('click', function(e){
			document.getElementById('product-sticky-footer-buy-button').classList.add('hidden');
		});
	})
}

function updateContentVariantChange(stickyFooter){
	//console.log('updateContentVariantChange');
	const variantID = document.querySelector('.product__info-container .product-variant-id');
	//console.log('variantID', variantID.value);

	variantID.addEventListener('change', function(e){
		//console.log('variantID', document.querySelector('.product__info-container .product-variant-id').value);
		stickyFooterContent(stickyFooter, true)
	});
}

document.addEventListener('DOMContentLoaded', function(){
	const stickyFooter = document.getElementById('product-sticky-footer-buy-button');
	updateContentVariantChange(stickyFooter);

	stickyFootBuyButton_Stick(stickyFooter);
	stickyFooterContent(stickyFooter, false);
	removeOnAddToCart();
});