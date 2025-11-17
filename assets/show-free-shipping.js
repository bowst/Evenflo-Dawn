function showFreeShipping(){
	console.log('showFreeShipping');
	setTimeout( function(){
		//Update shipping
		const shippingNotice = document.getElementById('free-shipping-notice-product');
		const shippingNoticeFooter = document.getElementById('free-shipping-notice-footer');
		let productPrice = false;

		if(document.querySelector('.product__info-container .price--on-sale')){
			//console.log('sale price');
			productPrice = document.querySelector('.product__info-container .price-item--sale').innerHTML;
		}else{
			//console.log('reg price');
			productPrice =  document.querySelector('.product__info-container .price-item--regular').innerHTML;
		}

		productPrice = productPrice.replace("$", "");
		
		if(productPrice > 200.00 ){
			shippingNotice.classList.remove('visually-hidden');
			shippingNoticeFooter.classList.remove('hidden');
			//console.log('free');

		}else{
			shippingNotice.classList.add('visually-hidden');
			shippingNoticeFooter.classList.add('hidden');
		}
	}, 1);
}

function updateShippingOnVariantChange(){
	const variantID = document.querySelector('.product__info-container .product-variant-id');

	variantID.addEventListener('change', function(e){
		showFreeShipping();
	});
}
document.addEventListener('DOMContentLoaded', function(){
	updateShippingOnVariantChange();
	showFreeShipping();
});