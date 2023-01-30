import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS, getMetadata,
} from './lib-franklin.js';

const LCP_BLOCKS = ['hero', 'product', 'category']; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

export function el(str) {
  const content = typeof str !== 'string' ? '' : str;
  const tmp = document.createElement('div');
  tmp.innerHTML = content;
  return tmp.firstElementChild;
}

export function htmlstr(strs, ...params) {
  let res = '';
  strs.forEach((s, i) => {
    const p = params[i];
    res += s;
    if (!p) { return; }
    if (p instanceof HTMLElement) {
      res += p.outerHTML;
    } else {
      res += p;
    }
  });
  return res;
}

export function toHtml(strs, ...params) {
  return el(htmlstr(strs, ...params));
}

function buildAutoBlock(main, blockName, replace = true, prepend = false) {
  const section = toHtml`<div>${buildBlock(blockName, { elems: [] })}</div>`;
  if (replace) {
    main.innerHTML = '';
  }
  return prepend ? main.prepend(section) : main.append(section);
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
const COMMERCE_PAGES = ['product', 'category'];

function buildAutoBlocks(main) {
  try {
    if (COMMERCE_PAGES.includes(getMetadata('pagetype'))) {
      buildAutoBlock(main, getMetadata('pagetype'));
      document.body.classList.add('commerce-page');
    } else {
      buildHeroBlock(main);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? main.querySelector(hash) : false;
  if (hash && element) element.scrollIntoView();

  await loadHeader(doc.querySelector('header'));
  await loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

/**
 * extra
 */

/**
 * Get product Data as Json
 * @param sku
 * @returns {Promise<productData>}
 */
export async function getProductData(sku) {
  const url = window.location.origin;

  let product = {};
  if (!sku) {
    return product;
  }
  const res = await fetch(`${url}/api/products/${sku}.json`);
  if (!res.ok) {
    throw Error('failed to get product data');
  }
  const json = await res.json();
  product = json.data;
  return product;
}

/**
 * get category data as Json
 * @param category
 * @returns {Promise<categoryData>}
 */
export async function getCategoryData(category) {
  const url = window.location.origin;

  let product = {};
  if (!category) {
    return product;
  }
  const res = await fetch(`${url}/api/categories/${category}.json`);
  if (!res.ok) {
    throw Error('failed to get product data');
  }
  const json = await res.json();
  product = json.data;
  return product;
}

/**
 * Helper function to create DOM elements
 * @param {string} tag DOM element to be created
 * @param {array} attributes attributes to be added
 */

export function createTag(tag, attributes, html) {
  // eslint-disable-next-line no-shadow
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement || html instanceof SVGElement) {
      el.append(html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  return el;
}

/**
 * Add meta tag to head
 * @param {string} name
 * @param {string} pval
 */
export function addMeta(name, pval = '') {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const val = pval.replace(/["'<>]/g, '');
  const tag = document.createElement('meta');
  tag.setAttribute(attr, name);
  tag.content = val;
  document.head.appendChild(tag);
}
