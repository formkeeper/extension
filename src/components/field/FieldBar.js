import React from "react";

import { useRef, useEffect, useContext } from "react";
import { debounce } from "../../lib/utils/helpers";
import { SAVE_AFTER_TIME } from "../../global/constants";
import { FieldsDispatch, StorageDispatch } from "../../global/context";
import { persistAndAddSnapshot } from "../../actions";

import { getFieldContent } from "./helpers";

function FieldBar({ field, fieldHash }) {
  const { el, selector } = field;

  const dispatch = useContext(FieldsDispatch);
  const storage = useContext(StorageDispatch);
  const fieldElem = useRef(el);
  useEffect(() => {
    function handleInput(e) {
      const content = getFieldContent(e.target);
      dispatch(
        persistAndAddSnapshot(storage, fieldHash, content)
      );
    }
    const debouncedInput = debounce(handleInput, SAVE_AFTER_TIME);

    if (!fieldElem.current) {
      console.warn("FieldBar: Element not cached, querying using " +
      `selector ${selector}...`);
      const found = document.querySelector(selector);
      if (!found) {
        throw new Error("FieldBar: Inconsistent linked field element, " +
        `active element ${selector} cannot be found `);
      }
      fieldElem.current = found;
    }

    const $el = fieldElem.current;
    $el.addEventListener("input", debouncedInput);
    return function cleanup() {
      $el.removeEventListener("input", debouncedInput);
    };
  /*
    dispatch and storage are guaranteed to be stable
  */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, fieldHash]);

  return (
    <div className="fieldbar">
      {selector}
    </div>
  );
}

export default FieldBar;