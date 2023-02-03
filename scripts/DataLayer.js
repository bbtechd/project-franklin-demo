export async function getProductFromCommerce() {
  // eslint-disable-next-line no-restricted-globals
  const test = '{"test": "TEST"}';
  const el = document.createElement('pre');
  el.setAttribute('style', 'break-word');
  el.setAttribute('white-space', 'pre-wrap');
  el.innerText = test;
  document.append(el);
}
