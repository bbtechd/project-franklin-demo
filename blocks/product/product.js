import {
  getProductData, titleCase, addMeta, getIcon, html
} from '../../scripts/scripts.js';

import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

let ph;

const attachment = (item) => /* html */ `<li class="product-attachment">
    <a href="${item.url}">
      <span class="attachment-icon">${getIcon(`attachment-${item.icon_type}`)}</span>
      <span class="attachment-name">${item.name}</span>
    </a>
  </li>`;

function resolvePlaceholder(key) {
  return ph[key] || key;
}

class ProductView {
  constructor(block) {
    this.block = block;
    this.product = undefined;
  }

  async load() {
    try {
      // this.sku = store.location.pathname.split('/').pop();
      this.sku = window.location.pathname.split('/').pop();
      this.product = await getProductData(this.sku);
      // store.product = this.product;
      document.title = this.product.name; // veracode-ignore
      addMeta('description', this.product.name);
      // store.emit('product:loaded');
      this.render();
    } catch (error) {
      this.render404();
    }
  }

  /**
   * Render a 404 if we were unable to load the product
   */
  render404() {
    this.block.innerHTML = /* html */ `
      <div class="product-heading">
          <h1>Uh-oh.... we were unable to find this product</h1>
      </div>
    `;
  }

  /**
   * Render the core scaffold of the product page
   */
  renderProductScaffolding() {
    this.block.innerHTML = /* html */ `
      <div class="product-block" data-testid="product-block">
        <div class="product-images">
          <picture><img src="${this.product.image}" data-testid="product-image" /></picture>
          <span hidden="hidden" data-testid="product-image-url">${this.product.image}</span>
        </div>
        <div class="details">
          <div class="manufacturer" data-testid="product-manufacturer">${titleCase(this.product.manufacturer || '')}</div>
          <div class="name"><h3>${this.product.name}</h3></div>
          <span hidden="hidden" data-testid="product-name">${this.product.name}</span>
        </div>
      </div>
      <div class="product-config" data-testid="product-price-cart">
        <product-actions data-sku="${this.product.sku}"></product-actions>
        <span hidden="hidden" data-testid="product-sku">${this.product.sku}</span>
      </div>
    `;
  }

  /**
   * Render the product details row
   */
  renderProductDetails() {
    const { product } = this;
    this.block.appendChild(html` <div class="product-details">
      ${product.description
    ? /* html */ `
        <div class="description">
          <h4>${resolvePlaceholder('productOverview')}</h4>
          <p>${product.description}</p>
        </div>`
    : ''}
      ${product.summary
    ? /* html */ `
        <div class="summary">
          <h4>${resolvePlaceholder('summary')}</h4>
          <p>${product.summary}</p>
        </div>`
    : ''}
    </div>`);
  }

  renderProductInfo() {
    this.block.appendChild(html` <div class="product-info">
      <h5>${resolvePlaceholder('guidesAndInfo')}</h5>
      <ul class="product-attachments">
        ${this.product.attachments.map(attachment).join('\n')}
      </ul>
    </div>`);
  }

  renderFeedback() {
    this.block.appendChild(html` <div id="product-ratings" />
      <div class="product-feedback-embed" id="product-info-survey" style="float:  right;"></div>`);
  }

  /**
   * Renders the product block
   */
  render() {
    const { product } = this;
    this.renderProductScaffolding();
    if (product.description || product.summary) {
      this.renderProductDetails();
    }

    if (product.attachments.length) {
      this.renderProductInfo();
    }

    this.renderFeedback();
  }
}

export default async function decorate(block) {
  ph = await fetchPlaceholders();
  const productView = new ProductView(block);
  await productView.load();
}
