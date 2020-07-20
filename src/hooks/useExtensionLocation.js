/*global chrome*/
import { useState, useEffect } from "react";

function useExtensionLocation(win = window) {
  const [location, setLocation] = useState(win.location.href);

  useEffect(() => {
    function handleUrlUpdated(req) {
      setLocation(req.url);
    }

    function onMessage(req, sender, sendResponse) {
      const eventToHandler = {
        "on_url_updated": handleUrlUpdated,
      };
      const handler = eventToHandler[req.type];
      if (handler) {
        handler.call(this, req, sender, sendResponse);
      }
    }

    chrome.runtime.onMessage.addListener(onMessage);
    return function cleanup() {
      chrome.runtime.onMessage.removeListener(onMessage);
    };
  });

  return location;
}

export default useExtensionLocation;
