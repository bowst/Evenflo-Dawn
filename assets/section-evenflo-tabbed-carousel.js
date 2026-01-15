/**
 * Tabbed Carousel - Auto-cycling tabs and images
 */
(function() {
  'use strict';

  function initTabbedCarousel(container) {
    const slides = container.querySelectorAll('.tabbed-carousel__slide');
    const tabs = container.querySelectorAll('.tabbed-carousel__tab');
    const intervalSeconds = parseInt(container.dataset.interval) || 5;
    
    if (slides.length === 0 || tabs.length === 0 || slides.length !== tabs.length) {
      return;
    }

    let currentIndex = 0;
    let autoplayTimer = null;

    // Set initial active state
    function setActiveIndex(index) {
      // Remove active state from all slides and tabs
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.style.opacity = '1';
          slide.style.visibility = 'visible';
          slide.style.position = 'relative';
        } else {
          slide.style.opacity = '0';
          slide.style.visibility = 'hidden';
          slide.style.position = 'absolute';
        }
      });

      tabs.forEach((tab, i) => {
        if (i === index) {
          tab.classList.add('tabbed-carousel__tab--active');
        } else {
          tab.classList.remove('tabbed-carousel__tab--active');
        }
      });

      currentIndex = index;
    }

    // Move to next slide
    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      setActiveIndex(nextIndex);
    }

    // Start autoplay
    function startAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
      }
      
      autoplayTimer = setInterval(() => {
        nextSlide();
      }, intervalSeconds * 1000);
    }

    // Stop autoplay
    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Initialize
    setActiveIndex(0);
    
    // Only start autoplay if there's more than one slide
    if (slides.length > 1) {
      startAutoplay();
    }

    // Cleanup on disconnect (for dynamic content)
    const observer = new MutationObserver(function(mutations) {
      if (!document.contains(container)) {
        stopAutoplay();
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initialize all tabbed carousels on page load
  function initAllCarousels() {
    const carousels = document.querySelectorAll('[id^="tabbed-carousel-"]');
    carousels.forEach(container => {
      initTabbedCarousel(container);
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllCarousels);
  } else {
    initAllCarousels();
  }

  // Reinitialize on section:load (Shopify theme editor)
  document.addEventListener('shopify:section:load', function(event) {
    const carousel = event.target.querySelector('[id^="tabbed-carousel-"]');
    if (carousel) {
      initTabbedCarousel(carousel);
    }
  });
})();

