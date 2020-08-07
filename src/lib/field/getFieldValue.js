/**
 * @param {HTMLElement} el
 * @returns {String|Null}
 */
export function getFieldValue(el) {
  const val = el.value;
  const content = el.textContent;

  if (val && val !== "") {
    return val;
  }

  if (content && content !== "") {
    return content;
  }

  return null;
}