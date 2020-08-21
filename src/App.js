/*global chrome*/
import React, { useReducer, useCallback } from "react";
import { Helmet } from "react-helmet";
import ReactDOM from "react-dom";
import rootReducer, { initialState } from "./reducers";
import { withThunk } from "./lib/utils/helpers";
import { FieldsDispatch } from "./global/context";

import useExtensionVisibility from "./hooks/useExtensionVisibility";

import Page from "./components/page/Page";
import "./App.css";

/*
  App is the main component.
*/
export function App() {
  const [isVisible, setIsVisible] = useExtensionVisibility();

  const [state, dispatchFunc] = useReducer(rootReducer, initialState);
  const dispatch = withThunk(dispatchFunc);

  const close = useCallback(() => {
    setIsVisible(false);
  // setIsVisible is guaranteed to be stable by react
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = isVisible ? { display: "block"} : { display: "none" };
  return (
    <div className="ext-wrapper" style={style}>
      <Helmet>
        <link
          key="content"
          type="text/css"
          rel="stylesheet"
          href={chrome.runtime.getURL("/static/css/app.css")}
        ></link>
      </Helmet>
      <div className="close" onClick={close}></div>
      <FieldsDispatch.Provider value={dispatch}>
        <Page
          document={document}
          window={window}
          fields={state.fields}
          snapshots={state.snapshots}/>
      </FieldsDispatch.Provider>
    </div>
  );
}

const app = document.createElement("div");
app.id = "formkeeper-root";
document.body.appendChild(app);
ReactDOM.render(<App />, app);

