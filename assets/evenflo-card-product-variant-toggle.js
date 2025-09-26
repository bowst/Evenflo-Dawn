// Initialize immediately and set up event delegation
(function() {
  // Set up event delegation on document - this will catch all clicks
  document.addEventListener('click', function(e) {
    // Check if the clicked element is a color swatch link
    if (e.target.closest('.color-swatches a')) {
      var targetSwatch = e.target.closest('.color-swatches a');
      toggleSwatches(e, targetSwatch);
    }
  });

  // Also watch for product-recommendations component specifically
  document.addEventListener('DOMContentLoaded', function() {
    watchForProductRecommendations();
  });

  function watchForProductRecommendations() {
    // Look for product-recommendations elements
    const productRecommendations = document.querySelectorAll('product-recommendations');
    
    productRecommendations.forEach(function(component) {
      // Watch for changes inside each product-recommendations component
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === 1) { // Element node
                if (node.querySelector && node.querySelector('.color-swatches a')) {
                  console.log('Product recommendations with swatches loaded');
                }
              }
            });
          }
        });
      });

      // Start observing changes within this product-recommendations component
      observer.observe(component, {
        childList: true,
        subtree: true
      });
    });
  }
})();

function toggleSwatches(e, targetSwatch) {
  e.preventDefault();
  
  if (!targetSwatch.classList.contains('active')) {
    var productCard = targetSwatch.closest('.product-card-wrapper') || targetSwatch.closest('.card-wrapper');
    var activeSwatch = productCard.querySelector('.color-swatches a.active');
    var activeImage = productCard.querySelector(activeSwatch.getAttribute('href'));
    var targetImage = productCard.querySelector(targetSwatch.getAttribute('href'));
    var variantTitle = productCard.querySelector('.variant-title');

    // Only proceed if we found all the necessary elements
    if (activeImage && targetImage && activeSwatch && variantTitle) {
      activeImage.classList.remove('active');
      activeSwatch.classList.remove('active');

      targetImage.classList.add('active');
      targetSwatch.classList.add('active');

      variantTitle.innerHTML = targetSwatch.getAttribute('title');
    }
  }
}