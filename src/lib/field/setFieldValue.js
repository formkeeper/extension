import { getLinkedElement } from "./getLinkedElement";

const fieldElementTypes = {
  Textarea: "TEXTAREA",
  Input: "INPUT",
  Div: "DIV",
};

function getElementType(el) {
  return el.nodeName;
}

export function setFieldValue(field, value) {
  const el = getLinkedElement(field);

  if (!el) {
    throw new Error(
      "setFieldValue: couldn't retrieve linked element" +
      `for field '${field.selector}' with value '${value}'`
    );
  }

  const type = getElementType(el);
  switch(type) {
  case fieldElementTypes.Textarea:
  case fieldElementTypes.Input:
    return el.value = value;
  case fieldElementTypes.Div:
    return el.innerText = value;
  default:
    throw new Error(
      `setFieldValue: unknown linked element nodeType ${type}`
    );
  }
}