import { useContext, useEffect } from "react";
import { FieldsDispatch } from "../global/context";
import { collectFields } from "../actions";

function useFieldCollector({ document, location }) {
  const dispatch = useContext(FieldsDispatch);
  useEffect(() => {
    dispatch(collectFields(document));
  /*
    We want collectFields to only be dispatched when location changes at
    startup. Also, dispatch is just a wrapped middleware of the stable
    dispatch function, collectFields is just an action function which
    doesn't depend on this component in any way and document is
    (obviously) always stable during component re-renders, so these
    dependencies are safe to omit in this case.
  */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
}

export default useFieldCollector;