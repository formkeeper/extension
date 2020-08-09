/*global chrome*/
import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import Frame, { FrameContextConsumer }from "react-frame-component";
import rootReducer, { initialState } from "./reducers";
import { withThunk } from "./lib/utils/helpers";
import { FieldsDispatch } from "./global/context";

import useExtensionVisibility from "./hooks/useExtensionVisibility";

import Page from "./components/page/Page";

/*
  App is the main component.
*/
export function App() {
  const isVisible = useExtensionVisibility();

  const [state, dispatchFunc] = useReducer(rootReducer, initialState);
  const dispatch = withThunk(dispatchFunc);

  const style = isVisible ? { display: "block"} : { display: "none" };
  return (
    <div className="ext-wrapper" style={style}>
      <Frame
        head={[
          <link
            key="content"
            type="text/css"
            rel="stylesheet"
            href={chrome.runtime.getURL("/static/css/app.css")}
          ></link>
        ]}>
        <FrameContextConsumer>
          {
            ({document, window}) => {
              return (
                <FieldsDispatch.Provider value={dispatch}>
                  <Page
                    document={document}
                    window={window}
                    fields={state.fields}
                    snapshots={state.snapshots}/>
                </FieldsDispatch.Provider>

              );
            }
          }
        </FrameContextConsumer>
      </Frame>
    </div>
  );
}

const app = document.createElement("div");
app.id = "formkeeper-root";
document.body.appendChild(app);
ReactDOM.render(<App />, app);

