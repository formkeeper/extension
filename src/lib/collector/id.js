import SHA256 from "./hash";

class ID {
  constructor(document) {
    this._document = document || window.document;
    this._selector = "";
    this._hash = "";
    this._isUnique = false;
  }

  async generate(el) {
    if (this._el) {
      return;
    }

    const attrStr = Array.from(el.attributes)
      .reduce((str, attr) => str += `[${attr.nodeName}='${attr.nodeValue}']`, "")
    this._selector = `${el.localName}${attrStr}`;
    this._hash = await SHA256(this._selector);

    const found = this._document.querySelectorAll(this._selector);
    const len = found.length;
    if (len > 1) {
      // Couldn't create an unique selector;
      return;
    }

    if (len < 1) {
      const err = new Error("ID: Couldn't create a valid selector. Generated unique selector for the element doesn't match any element on page, maybe the given element is in a different context window? (e.g. iframe)");
      err.name = "IDInvalidSelector";
      throw err;
    }

    this._isUnique = true;
    return this._el = el;
  }

  isUnique() {
    return this._isUnique;
  }

  get() {
    return this._hash;
  }

  getSelector() {
    return this._selector;
  }
}

export default ID;