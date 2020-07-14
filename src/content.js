/*global chrome*/
/* src/content.js */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
import Sidebar from "./components/sidebar/Sidebar";

/*
  useExtensions hook handles extension state in response to background events
*/
function useExtension() {
  const [isVisible, setVisible] = useState(0);
  const [location, setLocation] = useState(window.location.href);

  useEffect(() => {
    function handleUrlUpdated(req) {
      setLocation(req.url);
    }

    function handleBadgeClicked() {
      setVisible(!isVisible);
    }

    function onMessage(req, sender, sendResponse) {
      const eventToHandler = {
        "on_badge_click": handleBadgeClicked,
        "on_url_updated": handleUrlUpdated,
      }
      const handler = eventToHandler[req.type];
      handler.call(this, req, sender, sendResponse);
    }

    chrome.runtime.onMessage.addListener(onMessage);
    return function cleanup() {
      chrome.runtime.onMessage.removeListener(onMessage);
    }
  })

  return {
    isVisible,
    location
  }
}

function findElements(parentEl) {
  const selector = "linput:not([type='password']),textarea,[contenteditable],[contenteditable='false'],[spellcheck],[spellcheck='false']";
}

/*
  Page is the main component.

  The extension behaviour depends on the context, e.g. whenever a new page is visited (including SPA
  and server side pages) or a field (textarea, div with contenteditable, inputs...) is focused, this
  component (and the whole extension, consequently) will be re-rendered.
*/
function Page() {
  const { isVisible, location } = useExtension();

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
            ]}
          >
            <FrameContextConsumer>
              {
                ({document, window}) => {
                  return <Sidebar document={document} window={window} location={location}/>
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
ReactDOM.render(<Page />, app);

