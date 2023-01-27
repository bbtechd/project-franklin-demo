import { fetchPlaceholders, getMetadata } from '../../scripts/lib-franklin.js';
import { createTag, getProductData, addMeta } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  const productFields = ['Description', 'Manufacturer', 'Images'];

  const sku = window.location.pathname.split('/').pop();

  const productInfo = await getProductData(sku);

  const productName = productInfo[0].Name;
  addMeta('description', productName);

  const productData = [];

  productInfo.forEach((product) => {
    productFields.forEach((productField) => {
      productData.push(product[productField]);
    });
  });

  const productHeading = createTag('div', { class: 'product-heading' });
  const productDetailsDiv = createTag('div', { class: 'product-details-div' });
  const productImageDiv = createTag('div', { class: 'product-images' });
  const productDetails = createTag('div', { class: 'product-details' });

  document.title = `${productName} kaufen!`;
  productHeading.innerText = productName;

  productData.forEach((item, index) => {
    if (item) {
      const row = createTag('div', { class: 'row' });
      const label = createTag('div', { class: 'product-label' });
      if (productFields[index] === 'Images') {
        const productImages = item.split('\n');
        const productImage = createTag('img', { class: 'product-image' });
        productImage.setAttribute('src', productImages[0]);
        productImage.setAttribute('alt', 'product-image');
        productImage.setAttribute('src', productImages[0]);
        productImage.setAttribute('alt', 'product-image');
        const productImageZoom = createTag('figure', { class: 'zoom' });
        productImageZoom.setAttribute('style', `background-image : url(${productImage.src})`);
        productImageZoom.append(productImage);
        productImageDiv.append(productImageZoom);
        if (productImages.length > 1) {
          const productImageThumbnailWrapper = createTag('div', { class: 'product-image-thumbnail-wrapper' });
          productImages.forEach((img) => {
            const productImageThumbs = createTag('img', { class: 'product-image-thumbnails' });
            productImageThumbs.setAttribute('src', img);
            productImageThumbs.setAttribute('alt', 'product-image-thumbnail');
            productImageThumbnailWrapper.append(productImageThumbs);
          });
          productImageDiv.append(productImageThumbnailWrapper);
        }
        return;
      }
      label.innerText = placeholders[`${productFields[index]}`.toLowerCase()];
      const itemText = createTag('div', { class: 'product-field' });
      itemText.innerText = item;
      row.append(label, itemText);
      productDetails.append(row);
    }
  });

  block.innerHTML = '';
  productDetailsDiv.append(productImageDiv, productDetails);
  block.append(productHeading, productDetailsDiv);

  document.querySelector('.zoom').addEventListener('mousemove', (event)=>{
    const zoomer = event.currentTarget;
    const { offsetX } = event;
    const { offsetY } = event;
    const x = (offsetX / zoomer.offsetWidth) * 100;
    const y = (offsetY / zoomer.offsetHeight) * 100;
    zoomer.style.backgroundPosition = `${x}% ${y}%`;
  });

  const prodThumbnail = block.querySelectorAll('.product-image-thumbnails');
  const primaryImage = block.querySelector('.product-image');
  const primaryImageZoom = block.querySelector('.zoom');
  prodThumbnail.forEach((el) => {
    el.addEventListener('click', () => {
      primaryImage.setAttribute('src', el.src);
      primaryImageZoom.setAttribute('style', `background-image : url(${el.src})`);
    });
  });

  primaryImage.addEventListener('click', () => {
    const modal = createTag('div', { class: 'product-image-modal' });
    const modalContent = createTag('div', { class: 'product-image-modal-content' });
    const clonePrimary = primaryImage.cloneNode(true);
    modalContent.appendChild(clonePrimary);
    modal.append(modalContent);
    block.append(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });

  window.addEventListener('click', (event) => {
    const modal = block.querySelector('.product-image-modal');
    if (event.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      modal.remove();
    }
  });
}
