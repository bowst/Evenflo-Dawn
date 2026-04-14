/**
 * Evenflo Scroll Carousel - 2026
 * A reusable, accessible horizontal scroll carousel with snap points and dot pagination.
 * Carousel mode triggers automatically based on content overflow.
 * Slide sizing is controlled via CSS - this JS only handles overflow detection and navigation.
 * Pagination is slide-based for accurate navigation.
 */

class EvenfloScrollCarousel {
	constructor(element) {
	  this.container = element;
	  this.track = element.querySelector('.evenflo-scroll-carousel__track');
	  this.slides = element.querySelectorAll('.evenflo-scroll-carousel__slide');
	  this.pagination = element.querySelector('.evenflo-scroll-carousel__pagination');
	  this.liveRegion = null;
	  this.dots = [];
	  this.currentPage = 0;
	  this.totalPages = 1;
	  this.isOverflowing = false;
	  
	  this.carouselLabel = element.dataset.carouselLabel || 'Carousel';
	  
	  if (!this.track || this.slides.length === 0) return;
	  
	  this.init();
	  this.checkOverflow();
	  
	  if (typeof ResizeObserver !== 'undefined') {
		this.resizeObserver = new ResizeObserver(() => {
		  this.checkOverflow();
		  this.updateDots();
		});
		this.resizeObserver.observe(this.track);
	  } else {
		window.addEventListener('resize', this.debounce(() => {
		  this.checkOverflow();
		  this.updateDots();
		}, 200));
	  }
	}
	
	debounce(func, wait) {
	  let timeout;
	  return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	  };
	}
	
	init() {
	  this.setupAccessibility();
	  this.bindEvents();
	}
	
	setupAccessibility() {
	  this.container.setAttribute('role', 'region');
	  this.container.setAttribute('aria-roledescription', 'carousel');
	  this.container.setAttribute('aria-label', this.carouselLabel);
	  
	  this.track.setAttribute('role', 'group');
	  this.track.setAttribute('aria-label', 'Scrollable content');
	  
	  this.slides.forEach((slide, index) => {
		slide.setAttribute('aria-label', `Item ${index + 1} of ${this.slides.length}`);
	  });
	  
	  this.liveRegion = document.createElement('div');
	  this.liveRegion.setAttribute('aria-live', 'polite');
	  this.liveRegion.setAttribute('aria-atomic', 'true');
	  this.liveRegion.className = 'visually-hidden';
	  this.container.appendChild(this.liveRegion);
	}
	
	calculatePages() {
	  const viewportWidth = this.track.clientWidth;
	  const scrollWidth = this.track.scrollWidth;
	  const maxScroll = scrollWidth - viewportWidth;
	  
	  if (maxScroll <= 0) {
		return 1;
	  }
	  
	  // Get the first slide width to use as our "page" unit
	  const firstSlide = this.slides[0];
	  if (!firstSlide) return 1;
	  
	  const slideWidth = firstSlide.offsetWidth;
	  const gap = parseInt(getComputedStyle(this.track).gap) || 0;
	  const slideWithGap = slideWidth + gap;
	  
	  // Calculate how many slides fit in viewport
	  const slidesPerView = Math.floor((viewportWidth + gap) / slideWithGap);
	  
	  // If all slides fit, no pagination needed
	  if (slidesPerView >= this.slides.length) {
		return 1;
	  }
	  
	  // Pages = total slides - slides per view + 1
	  // This gives us the number of distinct "first visible slide" positions
	  return this.slides.length - slidesPerView + 1;
	}
	
	checkOverflow() {
	  const hasOverflow = this.track.scrollWidth > this.track.clientWidth + 1;
	  
	  if (hasOverflow !== this.isOverflowing) {
		this.isOverflowing = hasOverflow;
		
		if (hasOverflow) {
		  this.enableCarousel();
		} else {
		  this.disableCarousel();
		}
	  }
	}
	
	enableCarousel() {
	  this.container.classList.add('evenflo-scroll-carousel--active');
	  this.container.classList.remove('evenflo-scroll-carousel--inactive');
	  
	  this.track.setAttribute('tabindex', '0');
	  this.updateDots();
	}
	
	disableCarousel() {
	  this.container.classList.remove('evenflo-scroll-carousel--active');
	  this.container.classList.add('evenflo-scroll-carousel--inactive');
	  
	  if (this.pagination) {
		this.pagination.style.display = 'none';
	  }
	  
	  this.track.removeAttribute('tabindex');
	  this.track.scrollLeft = 0;
	}
	
	updateDots() {
	  if (!this.pagination || !this.isOverflowing) return;
	  
	  const newTotalPages = this.calculatePages();
	  
	  // Only recreate dots if the number of pages changed
	  if (newTotalPages !== this.totalPages) {
		this.totalPages = newTotalPages;
		this.createDots();
	  }
	  
	  this.pagination.style.display = this.totalPages > 1 ? 'flex' : 'none';
	  this.updateActiveDot();
	}
	
	createDots() {
	  if (!this.pagination) return;
	  
	  this.pagination.innerHTML = '';
	  this.dots = [];
	  
	  this.pagination.setAttribute('role', 'tablist');
	  this.pagination.setAttribute('aria-label', 'Page navigation');
	  
	  for (let i = 0; i < this.totalPages; i++) {
		const dot = document.createElement('button');
		dot.className = 'evenflo-scroll-carousel__dot';
		dot.setAttribute('role', 'tab');
		dot.setAttribute('aria-label', `Go to page ${i + 1} of ${this.totalPages}`);
		dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
		dot.setAttribute('tabindex', i === 0 ? '0' : '-1');
		dot.addEventListener('click', () => this.goToPage(i));
		this.pagination.appendChild(dot);
		this.dots.push(dot);
	  }
	  
	  if (this.dots.length > 0) {
		this.dots[0].classList.add('active');
	  }
	}
	
	bindEvents() {
	  let scrollTimeout;
	  this.track.addEventListener('scroll', () => {
		if (!this.isOverflowing) return;
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
		  this.updateActiveDot();
		}, 50);
	  });
	  
	  this.track.addEventListener('keydown', (e) => {
		if (!this.isOverflowing) return;
		
		switch (e.key) {
		  case 'ArrowLeft':
			e.preventDefault();
			this.goToPage(Math.max(0, this.currentPage - 1));
			break;
		  case 'ArrowRight':
			e.preventDefault();
			this.goToPage(Math.min(this.totalPages - 1, this.currentPage + 1));
			break;
		  case 'Home':
			e.preventDefault();
			this.goToPage(0);
			break;
		  case 'End':
			e.preventDefault();
			this.goToPage(this.totalPages - 1);
			break;
		}
	  });
	  
	  if (this.pagination) {
		this.pagination.addEventListener('keydown', (e) => {
		  if (!this.isOverflowing) return;
		  
		  const currentDotIndex = this.dots.findIndex(dot => dot === document.activeElement);
		  if (currentDotIndex === -1) return;
		  
		  let newIndex = currentDotIndex;
		  
		  switch (e.key) {
			case 'ArrowLeft':
			case 'ArrowUp':
			  e.preventDefault();
			  newIndex = Math.max(0, currentDotIndex - 1);
			  break;
			case 'ArrowRight':
			case 'ArrowDown':
			  e.preventDefault();
			  newIndex = Math.min(this.dots.length - 1, currentDotIndex + 1);
			  break;
			case 'Home':
			  e.preventDefault();
			  newIndex = 0;
			  break;
			case 'End':
			  e.preventDefault();
			  newIndex = this.dots.length - 1;
			  break;
		  }
		  
		  if (newIndex !== currentDotIndex) {
			this.dots[newIndex].focus();
			this.goToPage(newIndex);
		  }
		});
	  }
	}
	
	goToPage(pageIndex) {
	  if (!this.isOverflowing || pageIndex < 0 || pageIndex >= this.totalPages) return;
	  
	  const viewportWidth = this.track.clientWidth;
	  const maxScroll = this.track.scrollWidth - viewportWidth;
	  
	  // Get slide width + gap to calculate scroll position
	  const firstSlide = this.slides[0];
	  if (!firstSlide) return;
	  
	  const slideWidth = firstSlide.offsetWidth;
	  const gap = parseInt(getComputedStyle(this.track).gap) || 0;
	  const slideWithGap = slideWidth + gap;
	  
	  // Each page scrolls by one slide width
	  let scrollLeft = pageIndex * slideWithGap;
	  
	  // Don't scroll past the maximum
	  scrollLeft = Math.min(scrollLeft, maxScroll);
	  
	  this.track.scrollTo({
		left: scrollLeft,
		behavior: 'smooth'
	  });
	  
	  this.currentPage = pageIndex;
	  this.setActiveDot(pageIndex);
	  this.announcePage(pageIndex);
	}
	
	announcePage(pageIndex) {
	  if (this.liveRegion) {
		this.liveRegion.textContent = `Page ${pageIndex + 1} of ${this.totalPages}`;
	  }
	}
	
	updateActiveDot() {
	  if (this.dots.length === 0 || !this.isOverflowing) return;
	  
	  const scrollLeft = this.track.scrollLeft;
	  const viewportWidth = this.track.clientWidth;
	  const maxScroll = this.track.scrollWidth - viewportWidth;
	  
	  // Get slide width + gap
	  const firstSlide = this.slides[0];
	  if (!firstSlide) return;
	  
	  const slideWidth = firstSlide.offsetWidth;
	  const gap = parseInt(getComputedStyle(this.track).gap) || 0;
	  const slideWithGap = slideWidth + gap;
	  
	  // Calculate current page based on scroll position
	  let currentPage;
	  if (scrollLeft >= maxScroll - 1) {
		// At the end, select last dot
		currentPage = this.totalPages - 1;
	  } else {
		currentPage = Math.round(scrollLeft / slideWithGap);
	  }
	  
	  currentPage = Math.max(0, Math.min(currentPage, this.totalPages - 1));
	  
	  if (this.currentPage !== currentPage) {
		this.currentPage = currentPage;
		this.setActiveDot(currentPage);
	  }
	}
	
	setActiveDot(index) {
	  this.dots.forEach((dot, i) => {
		const isActive = i === index;
		dot.classList.toggle('active', isActive);
		dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
		dot.setAttribute('tabindex', isActive ? '0' : '-1');
	  });
	}
	
	destroy() {
	  if (this.resizeObserver) {
		this.resizeObserver.disconnect();
	  }
	}
  }
  
  function initEvenfloScrollCarousels() {
	document.querySelectorAll('.evenflo-scroll-carousel').forEach(carousel => {
	  if (!carousel.evenfloCarouselInstance) {
		carousel.evenfloCarouselInstance = new EvenfloScrollCarousel(carousel);
	  }
	});
  }
  
  document.addEventListener('DOMContentLoaded', initEvenfloScrollCarousels);
  
  if (typeof Shopify !== 'undefined' && Shopify.designMode) {
	document.addEventListener('shopify:section:load', initEvenfloScrollCarousels);
  }
  