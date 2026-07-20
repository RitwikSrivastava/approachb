import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Approach B (https://www.aem.live/docs/media#approach-b-asset-management-delivery):
 * the image field is authored as a link pointing at the DAM/Dynamic Media delivery
 * CDN, not as an embedded picture. Rewrite that link into an optimized <picture>
 * here in the browser.
 * @param {Element} cell field wrapper holding the authored image link
 * @param {string} alt alt text for the resulting <img>
 */
function decorateLinkedImage(cell, alt) {
  const picture = cell.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, alt || img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    picture.replaceWith(optimizedPic);
    return;
  }
  const link = cell.querySelector('a[href]');
  const imageUrl = link ? link.href : cell.textContent.trim();
  if (!imageUrl) return;
  const optimizedPic = createOptimizedPicture(imageUrl, alt, false, [{ width: '750' }]);
  moveInstrumentation(link || cell, optimizedPic.querySelector('img'));
  cell.replaceChildren(optimizedPic);
}

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

  const alt = altCell?.textContent.trim() || titleCell?.textContent.trim() || '';

  if (imageCell) {
    decorateLinkedImage(imageCell, alt);
    imageCell.className = 'image-card-image';
  }

  altCell?.remove();
  if (titleCell) titleCell.className = 'image-card-title';
  if (textCell) textCell.className = 'image-card-body';
}
