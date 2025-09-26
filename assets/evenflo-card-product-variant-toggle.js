// Debug version - let's see what's happening
console.log('Evenflo swatch toggle script loaded');

// Set up event delegation immediately
document.addEventListener('click', function(e) {
  console.log('Click detected on:', e.target);
  
  // Check if the clicked element is a color swatch link
  var swatchLink = e.target.closest('.color-swatches a');
  if (swatchLink) {
    console.log('Swatch link clicked:', swatchLink);
    toggleSwatches(e, swatchLink);
  } else {
    // Let's also check if it's any link inside color-swatches
    var colorSwatches = e.target.closest('.color-swatches');
    if (colorSwatches) {
      console.log('Click inside color-swatches but not on link:', e.target);
    }
  }
});

// Also try a more aggressive approach - check for swatches periodically
function checkForSwatches() {
  var swatches = document.querySelectorAll('.color-swatches a');
  console.log('Found swatches:', swatches.length);
  
  if (swatches.length > 0) {
    swatches.forEach(function(swatch, index) {
      console.log('Swatch', index, ':', swatch);
    });
  }
}

// Check immediately and then periodically
checkForSwatches();
setInterval(checkForSwatches, 2000);

// Watch for DOM changes
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          if (node.querySelector && node.querySelector('.color-swatches a')) {
            console.log('New swatches detected via MutationObserver');
            checkForSwatches();
          }
        }
      });
    }
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

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