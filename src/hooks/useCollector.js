import { useContext, useEffect } from "react";
import { FieldsDispatch } from "../global/context";
import { retrieveAndCollectState } from "../actions";

function useCollector(storage, location) {
  const dispatch = useContext(FieldsDispatch);
  useEffect(() => {
    dispatch(retrieveAndCollectState(storage));
  /*
    We want retrieveAndCollectState to only be dispatched when location changes
    at startup. Also, dispatch is just a wrapped middleware of the stable
    dispatch function, storage is a global Storage object which only depends on
    the location and retrieveAndCollectState is just an action function
    which doesn't depend on this component in any way, so these dependencies are
    safe to omit in this case.
  */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
}

export default useCollector;