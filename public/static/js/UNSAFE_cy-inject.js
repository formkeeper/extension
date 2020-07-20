/* global chrome */
/*
 IMPORTANT NOTE: Intended for testing purposes, this file will be auto. removed
 in prod builds. It's also insecure as it exposes hooks to WebExtensions API
 and it will execute, in the same context that the extension being developed,
 any WebExtension API (chrome API) command sent by window.postMessage.

 If included in production, untrusted websites could have the equivalent
 privileges of installing an extension, with the same permissions that this one,
on the browser of the users of this extension.
*/

const CYCOMMAND = "cy-command";
// const CYRESPONSE = "cy-response";
const win = window.top;

function send(id, propertyPath, method, methodType, args) {
  chrome.runtime.sendMessage({
    id,
    type: CYCOMMAND,
    target: {
      propertyPath, method, methodType, args,
    },
  }, (response) => {
    if (!response) {
      return;
    }

    if (response.skipped) {
      return;
    }

    const noPreferenceTargetOrigin = "*";
    win.postMessage(response, noPreferenceTargetOrigin);
  });
}

function onWinMessage(evt) {
  if (!evt.data) {
    return false;
  }

  if (evt.data.type !== CYCOMMAND) {
    return false;
  }
  const { propertyPath, method, methodType, args } = evt.data.target;
  send(evt.data.id, propertyPath, method, methodType, args);
}

win.addEventListener("message", onWinMessage);
