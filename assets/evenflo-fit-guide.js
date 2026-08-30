/**
 * Fit Guide — client-side stepper/filter behavior only.
 *
 * Every product card and every fit-detail card is already rendered in the
 * DOM server-side (for SEO/AI crawlers). This script never fetches content —
 * it only toggles the `hidden` attribute and scrolls, so the page degrades
 * gracefully with JS disabled (everything is simply visible at once).
 */
class FitGuide extends HTMLElement {
  connectedCallback() {
    this.categorySelect = this.querySelector('[data-fit-guide-category]');
    this.productSelect = this.querySelector('[data-fit-guide-product]');
    this.weightInput = this.querySelector('[data-fit-guide-weight]');
    this.heightInput = this.querySelector('[data-fit-guide-height]');
    this.resetButtons = this.querySelectorAll('[data-fit-guide-reset]');
    this.filtersStep = this.querySelector('[data-fit-guide-step="filters"]');
    this.resultsStep = this.querySelector('[data-fit-guide-step="results"]');
    this.detailStep = this.querySelector('[data-fit-guide-step="detail"]');
    this.grid = this.querySelector('[data-fit-guide-grid]');
    this.noResults = this.querySelector('[data-fit-guide-no-results]');
    this.items = Array.from(this.querySelectorAll('[data-fit-guide-item]'));
    this.detailCards = Array.from(this.querySelectorAll('[data-fit-guide-detail]'));

    this.categorySelect.addEventListener('change', () => {
      this.populateProductOptions();
      this.applyFilters();
    });
    this.productSelect.addEventListener('change', () => this.applyFilters());
    this.weightInput.addEventListener('input', () => this.applyFilters());
    this.heightInput.addEventListener('input', () => this.applyFilters());

    this.resetButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        this.reset();
      });
    });

    this.querySelectorAll('[data-fit-guide-view-details]').forEach((button) => {
      button.addEventListener('click', () => this.showDetail(button.dataset.productId));
    });

    this.querySelectorAll('[data-fit-guide-detail-change]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this.showResults();
      });
    });
  }

  populateProductOptions() {
    const categoryId = this.categorySelect.value;
    const currentValue = this.productSelect.value;
    this.productSelect.innerHTML = '';

    if (!categoryId) {
      this.productSelect.disabled = true;
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Select a category first';
      this.productSelect.appendChild(option);
      return;
    }

    this.productSelect.disabled = false;
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'All products in this category';
    this.productSelect.appendChild(placeholder);

    const seen = new Set();
    this.items
      .filter((item) => item.dataset.category === categoryId)
      .forEach((item) => {
        const id = item.dataset.productId;
        if (seen.has(id)) return;
        seen.add(id);
        const option = document.createElement('option');
        option.value = id;
        option.textContent = item.dataset.productTitle;
        this.productSelect.appendChild(option);
      });

    if (seen.has(currentValue)) {
      this.productSelect.value = currentValue;
    }
  }

  getFilters() {
    return {
      category: this.categorySelect.value,
      product: this.productSelect.value,
      weight: this.weightInput.value ? parseFloat(this.weightInput.value) : null,
      height: this.heightInput.value ? parseFloat(this.heightInput.value) : null,
    };
  }

  itemMatches(item, filters) {
    if (filters.category && item.dataset.category !== filters.category) return false;
    if (filters.product && item.dataset.productId !== filters.product) return false;

    if (filters.weight !== null) {
      const min = parseFloat(item.dataset.weightMin);
      const max = parseFloat(item.dataset.weightMax);
      if (Number.isNaN(min) || Number.isNaN(max)) return false;
      if (filters.weight < min || filters.weight > max) return false;
    }

    if (filters.height !== null) {
      const min = parseFloat(item.dataset.heightMin);
      const max = parseFloat(item.dataset.heightMax);
      if (Number.isNaN(min) || Number.isNaN(max)) return false;
      if (filters.height < min || filters.height > max) return false;
    }

    return true;
  }

  applyFilters() {
    const filters = this.getFilters();
    const hasActiveFilter = Boolean(
      filters.category || filters.product || filters.weight !== null || filters.height !== null
    );

    this.resetButtons.forEach((button) => {
      button.hidden = !hasActiveFilter;
    });

    if (!hasActiveFilter) {
      this.resultsStep.hidden = true;
      this.detailStep.hidden = true;
      return;
    }

    let visibleCount = 0;
    this.items.forEach((item) => {
      const matches = this.itemMatches(item, filters);
      item.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    this.resultsStep.hidden = false;
    this.noResults.hidden = visibleCount > 0;
    this.grid.hidden = visibleCount === 0;

    this.resultsStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showDetail(productId) {
    this.detailCards.forEach((card) => {
      card.hidden = card.dataset.productId !== productId;
    });
    this.detailStep.hidden = false;
    this.detailStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showResults() {
    this.detailStep.hidden = true;
    this.resultsStep.hidden = false;
    this.resultsStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  reset() {
    this.categorySelect.value = '';
    this.weightInput.value = '';
    this.heightInput.value = '';
    this.populateProductOptions();
    this.resultsStep.hidden = true;
    this.detailStep.hidden = true;
    this.resetButtons.forEach((button) => {
      button.hidden = true;
    });
    this.filtersStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

if (!customElements.get('fit-guide')) {
  customElements.define('fit-guide', FitGuide);
}
