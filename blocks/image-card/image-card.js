/**
 * Locates a model field's wrapper div, preferring the Universal Editor
 * instrumentation attribute and falling back to authoring column order.
 * @param {Element} block the block element
 * @param {string} name model field name
 * @param {number} index fallback column index
 * @returns {Element|null} the field wrapper, if present
 */
function getField(block, name, index) {
  return block.querySelector(`:scope > div > div[data-aue-prop="${name}"]`)
    || block.children[0]?.children[index]
    || null;
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const imageCell = getField(block, 'image', 0);
  const altCell = getField(block, 'imageAlt', 1);
  const titleCell = getField(block, 'title', 2);
  const textCell = getField(block, 'text', 3);

  // aem-assets-plugin's decorateExternalImages (Approach B - see
  // https://www.aem.live/docs/media#approach-b-asset-management-delivery) already
  // ran in decorateMain, before blocks are decorated, and rewrote the authored image
  // link into an optimized <picture>. imageAlt is a separate model field/cell, so the
  // plugin has no visibility into it - fill in the alt text here when it found none.
  const img = imageCell?.querySelector('picture img');
  const fallbackAlt = altCell?.textContent.trim() || titleCell?.textContent.trim() || '';
  if (img && !img.getAttribute('alt') && fallbackAlt) {
    img.setAttribute('alt', fallbackAlt);
  }

  if (imageCell) imageCell.className = 'image-card-image';
  altCell?.remove();
  if (titleCell) titleCell.className = 'image-card-title';
  if (textCell) textCell.className = 'image-card-body';
}
