function evenfloMobileContentShuffle(){
	const productContainer = document.getElementById('evenflo-product-container');
	//const productText = productContainer.querySelector('.product__info-container .product__text').cloneNode(true);
	const productTitle = productContainer.querySelector('.product__info-container .product__title').cloneNode(true);
	const productRating = productContainer.querySelector('.product__info-container .shopify-app-block').cloneNode(true);
	let mobileProductHeading = document.createElement("div");
	
	mobileProductHeading.classList.add('mobile-product-heading');
	mobileProductHeading.setAttribute('aria-hidden', 'true');
	
	//if(productText !== null ){
	//	mobileProductHeading.appendChild(productText);
	//}
	if(productTitle !== null ){
		mobileProductHeading.appendChild(productTitle);
	}
	if(productRating !== null ){
		mobileProductHeading.appendChild(productRating);
	}
	if( mobileProductHeading.hasChildNodes() ){
		productContainer.classList.add('evenflo-mobile-content-shuffle');
		productContainer.prepend(mobileProductHeading);
	}
}
document.addEventListener('DOMContentLoaded', function(){
	evenfloMobileContentShuffle();
});