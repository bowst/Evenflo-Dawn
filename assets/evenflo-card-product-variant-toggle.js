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

  // Watch for product-recommendations components using MutationObserver
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        // Check if product-recommendations elements were added
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'PRODUCT-RECOMMENDATIONS') {
              // Watch for changes inside this new product-recommendations component
              const productObserver = new MutationObserver(function(productMutations) {
                productMutations.forEach(function(productMutation) {
                  if (productMutation.type === 'childList') {
                    productMutation.addedNodes.forEach(function(productNode) {
                      if (productNode.nodeType === 1) { // Element node
                        if (productNode.querySelector && productNode.querySelector('.color-swatches a')) {
                          console.log('Product recommendations with swatches loaded');
                        }
                      }
                    });
                  }
                });
              });

              // Start observing changes within this product-recommendations component
              productObserver.observe(node, {
                childList: true,
                subtree: true
              });
            }
          }
        });
      }
    });
  });

  // Start observing the document for new product-recommendations elements
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
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