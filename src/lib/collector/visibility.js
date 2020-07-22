function normalize(cssProp) {
  return cssProp.replace(/%/, "");
}

/**
 * isHidden checks whether a given element is hidden or not by checking its
 * attributes and css properties.
 *
 * @param {HTMLElement} elem
 * @param {Window} [win=window]
 */
function isHidden(elem, win=window) {
  const css = win.getComputedStyle(elem);
  return (
    css["display"] === "none" ||
    css["opacity"] === "0" ||
    css["visibility"] === "hidden" ||
    (elem.getAttribute("hidden") === "" || elem.getAttribute("hidden") === "true") ||
    css["transform"] === "scale(0)" ||
    normalize(css["filter"]) === "opacity(0)"
  );
}

export default isHidden;