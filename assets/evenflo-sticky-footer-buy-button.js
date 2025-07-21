function stickyFootBuyButton_Stick(stickyFooter){
	let lastScrollTop = 0;

	window.addEventListener('scroll', function() {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
		const winHeight = window.innerHeight || document.documentElement.clientHeight;
		const scrollPercent = scrollTop / (docHeight - winHeight);
		const isScrollingDown = scrollTop > lastScrollTop;

		if (scrollPercent >= 0.5 && isScrollingDown) {
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
document.addEventListener('DOMContentLoaded', function(){
	const stickyFooter = document.getElementById('product-sticky-footer-buy-button');

	stickyFootBuyButton_Stick(stickyFooter);
	stickyFooterBuyButton_Content(stickyFooter);
});