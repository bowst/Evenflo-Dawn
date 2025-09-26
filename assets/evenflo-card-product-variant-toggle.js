// Use event delegation to handle dynamically loaded swatches
document.addEventListener('DOMContentLoaded', function() {
  initializeSwatchToggles();
});

// Also run when the page is fully loaded (for dynamic content)
document.addEventListener('load', function() {
  initializeSwatchToggles();
});

function initializeSwatchToggles() {
  // Use event delegation on the document to catch clicks on swatches
  document.addEventListener('click', function(e) {
    // Check if the clicked element is a color swatch link
    if (e.target.closest('.color-swatches a')) {
      var targetSwatch = e.target.closest('.color-swatches a');
      toggleSwatches(e, targetSwatch);
    }
  });
}

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