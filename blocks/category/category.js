import { createTag, getCategoryData, addMeta } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const productPath = `${window.location.origin}/products/`;
  const productFields = ['productName', 'productImage', 'sku'];

  const category = window.location.pathname.split('/').pop();

  const categoryInfo = await getCategoryData(category);

  const { categoryName } = categoryInfo[0];
  addMeta('description', categoryName);
  document.title = `${categoryName}`;

  const categoryData = [];

  categoryInfo.forEach((product, index) => {
    if (!categoryData[index]) {
      // eslint-disable-next-line no-array-constructor
      categoryData.push(Array());
    }
    productFields.forEach((productField) => {
      categoryData[index].push(product[productField]);
    });
  });

  const categoryHeading = createTag('div', { class: 'product-heading' });
  const productListings = createTag('div', { class: 'product-listings' });

  categoryHeading.innerText = categoryName;

  categoryData.forEach((product) => {
    const productCard = createTag('div', { class: 'product-card' });
    product.forEach((item, index) => {
      if (item) {
        const productDetails = createTag('div', { class: 'product-details' });
        if (productFields[index] === 'productImage') {
          const productImage = createTag('img', { class: 'product-image' });
          productImage.setAttribute('src', item);
          productImage.setAttribute('alt', 'product-image');
          productCard.append(productImage);
        } else if (productFields[index] === 'sku') {
          productCard.addEventListener('click', () => { window.open(productPath + item); }, false);
          return;
        } else {
          const itemText = createTag('div', { class: 'product-field' });
          itemText.innerText = item;
          productDetails.append(itemText);
        }
        productCard.append(productDetails);
      }
    });
    productListings.append(productCard);
  });

  block.innerHTML = '';

  block.append(categoryHeading, productListings);
}
