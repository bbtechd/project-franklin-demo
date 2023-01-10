export default async function decorate(block) {
  const a = block.querySelector('a');
  if (a) {
    const source = a.href;
    block.innerHTML = `
    <video autoplay controls>
      <source src="${source}" type="video/${source.split('.').pop()}" >
    </video>
    `;
  }
}
