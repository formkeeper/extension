/*global chrome*/
import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
import rootReducer, { initialState } from './reducers';
import { withThunk } from './lib/utils/helpers';
import { FieldsDispatch } from "./global/context";

import useExtensionVisibility from "./hooks/useExtensionVisibility";

import Page from "./components/page/Page";

// TODO - Fix eslint errors
// TODO - Prevent push if test fails

/**
  App is the main component.

  The extension behaviour depends on the context, e.g. whenever a new page is visited (including SPA
  and server side pages) or a field (textarea, div with contenteditable, inputs...) is focused, this
  component (and the whole extension, consequently) will be re-rendered.
*/
export function App() {
  const isVisible = useExtensionVisibility();

  const [state, dispatchFunc] = useReducer(rootReducer, initialState);
  const dispatch = withThunk(dispatchFunc);

  if (isVisible) {
    return (
      <div id="ext-wrapper">
        <div className="sidebar-wrapper">
          <Frame
            head={[
              <link
                key="content"
                type="text/css"
                rel="stylesheet"
                href={chrome.runtime.getURL("/static/css/App.css")}
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
                      fields={state.fields}/>
                  </FieldsDispatch.Provider>

                  )
                }
              }
            </FrameContextConsumer>
          </Frame>
        </div>
      </div>
    );
  }
  return null;
}

const app = document.createElement('div');
app.id = "formkeeper-root";
document.body.appendChild(app);
ReactDOM.render(<App />, app);

