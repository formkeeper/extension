import { getLinkedElement } from "./getLinkedElement";

export function animate(field, className, waitForAnimation=1e3) {
  const el = getLinkedElement(field);

  if (!el) {
    throw new Error(
      "animate: couldn't retrieve linked element" +
      `for field '${field.selector}' with animation '${className}'`
    );
  }

  el.classList.add(className);
  setTimeout(() => {
    el.classList.remove(className);
  }, waitForAnimation);
}