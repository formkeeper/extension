/*global chrome*/
/* src/content.js */
import React, { useEffect, useState, useReducer, useContext } from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
import Sidebar from "./components/sidebar/Sidebar";
import { collectFields } from './actions';
import rootReducer, { initialState } from './reducers';
import { withThunk } from './lib/utils/helpers';

/*
  useExtensions hook handles extension state in response to background events
*/
function useExtensionLocation(win = window) {
  const [location, setLocation] = useState(win.location.href);

  useEffect(() => {
    function handleUrlUpdated(req) {
      setLocation(req.url);
    }

    function onMessage(req, sender, sendResponse) {
      const eventToHandler = {
        "on_url_updated": handleUrlUpdated,
      }
      const handler = eventToHandler[req.type];
      handler && handler.call(this, req, sender, sendResponse);
    }

    chrome.runtime.onMessage.addListener(onMessage);
    return function cleanup() {
      chrome.runtime.onMessage.removeListener(onMessage);
    }
  })

  return location;
}

function useExtensionVisibility() {
  const [isVisible, setVisible] = useState(0);

  useEffect(() => {
    function handleBadgeClicked() {
      setVisible(!isVisible);
    }

    function onMessage(req, sender, sendResponse) {
      const eventToHandler = {
        "on_badge_click": handleBadgeClicked,
      }
      const handler = eventToHandler[req.type];
      handler && handler.call(this, req, sender, sendResponse);
    }

    chrome.runtime.onMessage.addListener(onMessage);
    return function cleanup() {
      chrome.runtime.onMessage.removeListener(onMessage);
    }
  })

  return isVisible;
}

const FieldsDispatch = React.createContext(null);

/**
  Page is the main component.

  The extension behaviour depends on the context, e.g. whenever a new page is visited (including SPA
  and server side pages) or a field (textarea, div with contenteditable, inputs...) is focused, this
  component (and the whole extension, consequently) will be re-rendered.
*/
function Page({ window, document, fields }) {
  const location = useExtensionLocation(window);

  const dispatch = useContext(FieldsDispatch);
  useEffect(() => {
    dispatch(collectFields(fields, document));
  }, [location]);

  return (
    <div id="ext-wrapper">
      <div className="sidebar-wrapper">
          <Sidebar />
      </div>
    </div>
  );
}


function App() {
  const isVisible = useExtensionVisibility();

  const [state, dispatchFunc] = useReducer(rootReducer, initialState);
  const dispatch = withThunk(dispatchFunc);

  console.log(isVisible)
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
                href={chrome.runtime.getURL("/static/css/content.css")}
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

