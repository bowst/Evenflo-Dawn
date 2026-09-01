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
    this.productHint = this.querySelector('[data-fit-guide-product-hint]');
    this.items = Array.from(this.querySelectorAll('[data-fit-guide-item]'));
    this.detailCards = Array.from(this.querySelectorAll('[data-fit-guide-detail]'));

    this.enhanceSelects();

    this.categorySelect.addEventListener('change', () => {
      this.populateProductOptions();
      this.applyFilters();
    });
    this.productSelect.addEventListener('change', () => this.applyFilters());

    this._onDocumentClick = (event) => {
      if (!event.target.closest('.fit-guide__select')) this.closeAllSelects();
    };
    this._onDocumentKeydown = (event) => {
      if (event.key === 'Escape') this.closeAllSelects();
    };
    document.addEventListener('click', this._onDocumentClick);
    document.addEventListener('keydown', this._onDocumentKeydown);
    this.weightInput.addEventListener('input', () => this.applyFilters());
    this.weightInput.addEventListener('change', () => this.applyFilters());
    this.heightInput.addEventListener('input', () => this.applyFilters());
    this.heightInput.addEventListener('change', () => this.applyFilters());

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
      option.textContent = 'Product';
      this.productSelect.appendChild(option);
      if (this.productHint) this.productHint.hidden = false;
      this.syncCustomSelect(this.productSelect);
      return;
    }

    if (this.productHint) this.productHint.hidden = true;
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

    this.syncCustomSelect(this.productSelect);
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

    this.detailStep.hidden = true;
    this.resultsStep.hidden = false;
    this.noResults.hidden = visibleCount > 0;
    this.grid.hidden = visibleCount === 0;
  }

  showDetail(productId) {
    this.detailCards.forEach((card) => {
      card.hidden = card.dataset.productId !== productId;
    });
    this.resultsStep.hidden = true;
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
    this.syncCustomSelect(this.categorySelect);
    this.resultsStep.hidden = true;
    this.detailStep.hidden = true;
    this.resetButtons.forEach((button) => {
      button.hidden = true;
    });
    this.filtersStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onDocumentClick);
    document.removeEventListener('keydown', this._onDocumentKeydown);
  }

  enhanceSelects() {
    [this.categorySelect, this.productSelect].forEach((select) => this.enhanceSelect(select));
  }

  enhanceSelect(select) {
    if (!select || select.dataset.enhanced === 'true') return;
    select.dataset.enhanced = 'true';
    select.classList.add('fit-guide__select-native');
    select.setAttribute('aria-hidden', 'true');
    select.tabIndex = -1;

    let wrapper = select.closest('.fit-guide__select');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'fit-guide__select';
      select.parentNode.insertBefore(wrapper, select);
      wrapper.appendChild(select);
    }
    wrapper.classList.add('fit-guide__select--enhanced');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'fit-guide__select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const valueEl = document.createElement('span');
    valueEl.className = 'fit-guide__select-value';

    const caret = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    caret.setAttribute('class', 'fit-guide__select-caret');
    caret.setAttribute('viewBox', '0 0 12 8');
    caret.setAttribute('aria-hidden', 'true');
    const caretPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    caretPath.setAttribute('fill', 'none');
    caretPath.setAttribute('stroke', 'currentColor');
    caretPath.setAttribute('stroke-linecap', 'round');
    caretPath.setAttribute('stroke-linejoin', 'round');
    caretPath.setAttribute('stroke-width', '1.5');
    caretPath.setAttribute('d', 'm1 1.5 5 5 5-5');
    caret.appendChild(caretPath);
    trigger.append(valueEl, caret);

    const field = wrapper.closest('.fit-guide__field');
    const label = field && field.querySelector('.fit-guide__field-label');
    const selectKey = select.hasAttribute('data-fit-guide-category') ? 'category' : 'product';
    const triggerId = `FitGuide-${this.dataset.sectionId || 'select'}-${selectKey}-trigger`;
    trigger.id = triggerId;
    if (label && label.id) {
      trigger.setAttribute('aria-labelledby', label.id);
      label.addEventListener('click', () => {
        if (!select.disabled) trigger.click();
      });
    }

    const list = document.createElement('ul');
    list.className = 'fit-guide__select-list';
    list.setAttribute('role', 'listbox');
    list.hidden = true;

    wrapper.append(trigger, list);
    select._custom = { wrapper, trigger, valueEl, list };

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (select.disabled) return;
      this.toggleSelect(select);
    });

    trigger.addEventListener('keydown', (event) => this.onSelectKeydown(select, event));
    list.addEventListener('keydown', (event) => this.onSelectKeydown(select, event));
    list.addEventListener('click', (event) => {
      const option = event.target.closest('[role="option"]');
      if (!option) return;
      this.chooseOption(select, option.dataset.value);
    });

    this.syncCustomSelect(select);
  }

  syncCustomSelect(select) {
    const ui = select && select._custom;
    if (!ui) return;

    ui.trigger.disabled = select.disabled;
    ui.wrapper.classList.toggle('is-disabled', select.disabled);

    const selected = select.options[select.selectedIndex];
    ui.valueEl.textContent = selected ? selected.textContent : '';

    ui.list.replaceChildren();
    Array.from(select.options).forEach((option, index) => {
      const item = document.createElement('li');
      item.className = 'fit-guide__select-option';
      item.setAttribute('role', 'option');
      item.dataset.value = option.value;
      item.id = `FitGuide-${this.dataset.sectionId || 'select'}-${select.hasAttribute('data-fit-guide-category') ? 'category' : 'product'}-option-${index}`;
      item.textContent = option.textContent;
      item.tabIndex = -1;
      if (option.selected) item.setAttribute('aria-selected', 'true');
      ui.list.appendChild(item);
    });
  }

  toggleSelect(select) {
    const isOpen = select._custom.trigger.getAttribute('aria-expanded') === 'true';
    this.closeAllSelects();
    if (!isOpen) this.openSelect(select);
  }

  openSelect(select) {
    const ui = select._custom;
    ui.trigger.setAttribute('aria-expanded', 'true');
    ui.list.hidden = false;
    ui.wrapper.classList.add('is-open');
    const active = ui.list.querySelector('[aria-selected="true"]') || ui.list.firstElementChild;
    this.setActiveOption(select, active);
  }

  closeSelect(select) {
    const ui = select && select._custom;
    if (!ui) return;
    ui.trigger.setAttribute('aria-expanded', 'false');
    ui.list.hidden = true;
    ui.wrapper.classList.remove('is-open');
    this.setActiveOption(select, null);
  }

  closeAllSelects() {
    [this.categorySelect, this.productSelect].forEach((select) => this.closeSelect(select));
  }

  chooseOption(select, value) {
    const changed = select.value !== value;
    select.value = value;
    this.syncCustomSelect(select);
    if (changed) select.dispatchEvent(new Event('change', { bubbles: true }));
    this.closeSelect(select);
    select._custom.trigger.focus();
  }

  setActiveOption(select, option) {
    const ui = select._custom;
    if (!ui) return;
    ui.list.querySelectorAll('[role="option"]').forEach((item) => {
      item.classList.toggle('is-active', item === option);
    });
    if (option) {
      ui.trigger.setAttribute('aria-activedescendant', option.id);
      option.focus();
    } else {
      ui.trigger.removeAttribute('aria-activedescendant');
    }
  }

  onSelectKeydown(select, event) {
    const ui = select._custom;
    const isOpen = ui.trigger.getAttribute('aria-expanded') === 'true';
    const options = Array.from(ui.list.querySelectorAll('[role="option"]'));
    const current = ui.list.querySelector('.is-active') || ui.list.querySelector('[aria-selected="true"]');
    const currentIndex = options.indexOf(current);

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        this.closeAllSelects();
        this.openSelect(select);
        return;
      }
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      const next = options[Math.max(0, Math.min(options.length - 1, currentIndex + delta))] || options[0];
      this.setActiveOption(select, next);
      return;
    }

    if (event.key === 'Home' && isOpen) {
      event.preventDefault();
      this.setActiveOption(select, options[0]);
      return;
    }

    if (event.key === 'End' && isOpen) {
      event.preventDefault();
      this.setActiveOption(select, options[options.length - 1]);
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && isOpen) {
      event.preventDefault();
      if (current) this.chooseOption(select, current.dataset.value);
      return;
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      this.closeSelect(select);
      ui.trigger.focus();
    }
  }
}

if (!customElements.get('fit-guide')) {
  customElements.define('fit-guide', FitGuide);
}
