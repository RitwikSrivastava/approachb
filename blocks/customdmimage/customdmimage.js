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
  // Unlike imageAlt, the imageTitle field is merged by the AEM Universal Editor
  // exporter directly into the image field's own anchor (as its title attribute) -
  // see https://developer.adobe.com/uix/docs/extension-manager/extension-developed-by-adobe/configurable-asset-picker/
  // So there's no separate imageTitle cell to read: aem-assets-plugin's
  // decorateExternalImages (run in decorateMain, before blocks are decorated) already
  // picks up that title attribute and produces a <picture> with the correct alt text.
  const imageCell = getField(block, 'image', 0);
  const titleCell = getField(block, 'title', 1);
  const textCell = getField(block, 'text', 2);

  if (imageCell) imageCell.className = 'customdmimage-image';
  if (titleCell) titleCell.className = 'customdmimage-title';
  if (textCell) textCell.className = 'customdmimage-body';
}
