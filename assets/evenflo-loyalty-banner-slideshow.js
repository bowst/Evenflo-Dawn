// Evenflo Loyalty Banner Slideshow - Infinite Loop
(function() {
  'use strict';
  
  function initInfiniteSlideshow() {
    const loyaltySlideshows = document.querySelectorAll('.evenflo-loyalty-slideshow');
    
    loyaltySlideshows.forEach(function(slideshow) {
      const slideshowComponent = slideshow.closest('slideshow-component');
      if (!slideshowComponent) return;
      
      const slider = slideshowComponent.querySelector('.slider');
      if (!slider) return;
      
      const slides = Array.from(slider.querySelectorAll('.slideshow__slide:not([data-clone])'));
      if (slides.length <= 1) return; // No need to loop if only one slide
      
      // Store original slide width for calculations
      const originalSlideWidth = slides[0] ? slides[0].offsetWidth : 0;
      if (!originalSlideWidth) return;
      
      // Clone all slides and append to create infinite loop
      slides.forEach(function(slide) {
        const clone = slide.cloneNode(true);
        clone.setAttribute('data-clone', 'true');
        slider.appendChild(clone);
      });
      
      // Override autoRotateSlides to handle infinite loop
      if (slideshowComponent.autoRotateSlides) {
        const originalAutoRotate = slideshowComponent.autoRotateSlides.bind(slideshowComponent);
        
        slideshowComponent.autoRotateSlides = function() {
          const slider = this.slider;
          const sliderItemOffset = this.sliderItemOffset || originalSlideWidth;
          const currentScrollLeft = slider.scrollLeft;
          const originalSlidesWidth = originalSlideWidth * slides.length;
          
          // Calculate next position
          let nextPosition = currentScrollLeft + sliderItemOffset;
          
          // If we've scrolled past all original slides, reset to beginning seamlessly
          if (nextPosition >= originalSlidesWidth) {
            // Jump back to the start (will be seamless if done during transition)
            slider.scrollLeft = nextPosition - originalSlidesWidth;
          } else {
            slider.scrollLeft = nextPosition;
          }
          
          // Update current page for the component
          this.currentPage = Math.round(slider.scrollLeft / sliderItemOffset) + 1;
          if (this.currentPage > slides.length) {
            this.currentPage = this.currentPage - slides.length;
          }
          
          this.update();
          if (this.applyAnimationToAnnouncementBar) {
            this.applyAnimationToAnnouncementBar();
          }
        };
      }
      
      // Handle manual scroll to loop back seamlessly
      let isScrolling = false;
      slider.addEventListener('scroll', function() {
        if (isScrolling) return;
        
        const scrollLeft = slider.scrollLeft;
        const originalSlidesWidth = originalSlideWidth * slides.length;
        
        // If scrolled past original slides, jump back to start
        if (scrollLeft >= originalSlidesWidth) {
          isScrolling = true;
          slider.scrollLeft = scrollLeft - originalSlidesWidth;
          setTimeout(function() {
            isScrolling = false;
          }, 50);
        }
        // If scrolled before start (shouldn't happen, but safety check)
        else if (scrollLeft < 0) {
          isScrolling = true;
          slider.scrollLeft = originalSlidesWidth + scrollLeft;
          setTimeout(function() {
            isScrolling = false;
          }, 50);
        }
      });
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInfiniteSlideshow);
  } else {
    initInfiniteSlideshow();
  }
  
  // Also initialize after a short delay to catch dynamically loaded content
  setTimeout(initInfiniteSlideshow, 100);
})();
