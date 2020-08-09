import { useEffect, useRef, useContext } from "react";

import { FieldsDispatch, StorageDispatch } from "../global/context";
import { getFieldValue } from "../lib/field";
import { persistAndAddSnapshot } from "../actions";
import { debounce } from "../lib/utils/helpers";
import { DEFAULT_SAVE_AFTER_TIME } from "../global/constants";

/**
 * useField is a hook that takes a field object, his fieldHash and then
 * sets up the events and handles the dispatch of the corresponding actions
 * creators for the DOM element linked to the field. In other words, useField
 * creates and persists the snapshots in react to the events of the DOM element
 * linked to the field.
 *
 * The linked DOM element is cached in the local scope.
 *
 * The dispatch of the snapshots when the DOM element changes is debounced
 * with a timeout set by the DEFAULT_SAVE_AFTER_TIME global constant. So
 * the snapshot won't be added until the user stops typing in the linked DOM
 * element for DEFAULT_SAVE_AFTER_TIME milliseconds.
 *
 * @param {Object} field
 * @param {String} fieldHash
 */
function useField(field, fieldHash) {
  const { el, selector } = field;

  const dispatch = useContext(FieldsDispatch);
  const storage = useContext(StorageDispatch);
  const fieldElem = useRef(el);
  useEffect(() => {
    function handleInput(e) {
      const content = getFieldValue(e.target);
      dispatch(
        persistAndAddSnapshot(storage, fieldHash, content)
      );
    }
    const debouncedInput = debounce(handleInput, DEFAULT_SAVE_AFTER_TIME);

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
    return () => {
      $el.removeEventListener("input", debouncedInput);
    };
  /*
    dispatch and storage are guaranteed to be stable
  */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, fieldHash]);

}

export default useField;