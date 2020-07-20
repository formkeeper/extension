import { useContext, useEffect } from "react";
import { FieldsDispatch } from "../global/context";
import { collectFields } from "../actions";

function useFieldCollector({ fields, document, location }) {
  const dispatch = useContext(FieldsDispatch);
  useEffect(() => {
    // TODO - remove fields (collect them directly from storage within
    // collect())
    dispatch(collectFields(fields, document));
  }, [location]);
}

export default useFieldCollector;