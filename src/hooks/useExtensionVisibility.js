/*global chrome*/
import { useState, useEffect } from "react";

function useExtensionVisibility() {
  const [isVisible, setVisible] = useState(0);

  useEffect(() => {
    function handleBadgeClicked() {
      setVisible(!isVisible);
    }

    function onMessage(req, sender, sendResponse) {
      const eventToHandler = {
        "on_badge_click": handleBadgeClicked,
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

  return isVisible;
}

export default useExtensionVisibility;