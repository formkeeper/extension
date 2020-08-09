export function getLinkedElement(field) {
  const { el, selector } = field;
  if (el) {
    return el;
  }
  return document.querySelector(selector);
}