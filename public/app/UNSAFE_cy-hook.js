// IMPORTANT NOTE: Intended for testing purposes, this file will be auto. removed in prod builds. It's also
// insecure as it exposes hooks to WebExtensions API and it will execute, in the same context that the extension
// being developed, any WebExtension API (chrome API) command sent by window.postMessage.
//
// If included in production, untrusted websites could have the equivalent privileges of installing an extension,
// with the same permissions that this one, on the browser of the users of this extension.

const CYCOMMAND = "cy-command";
const CYRESPONSE = "cy-response";
const METHOD_TYPE = {
  PROMISE: "method-type-promise",
  CALLBACK: "method-type-callback",
}
const hasStoragePermission = !!chrome.storage;

let commandsLog = {};


function clearStorage() {
  if (hasStoragePermission) {
    chrome.storage.local.clear();
  }
}

function clearAll() {
  clearStorage();
  commandsLog = {};
}

function resolveTarget(propPath, top) {
  return propPath
    .split(".")
    .reduce((accObj, nextKey) => accObj[nextKey], top);
}

function execCommand({target}) {
  const { propertyPath, method, methodType, args } = target;
  const targetObj = resolveTarget(propertyPath, chrome);

  if (!method) {
    return targetObj;
  }

  switch(methodType) {
    case METHOD_TYPE.CALLBACK:
    return new Promise((resolve, reject) => {
      targetObj[method].call(targetObj, ...args, res => {
        return chrome.runtime.lastError
          ? reject(chrome.runtime.lastError)
          : resolve(res)
      });
    });
    case METHOD_TYPE.PROMISE:
      return new Promise((resolve, reject) => {
        targetObj[method].apply(targetObj, args)
          .then(resolve)
          .catch(reject);
      });
  }
}

const skipCommand = id => commandsLog[id];
const addCommand = comm => commandsLog[comm.id] = comm;

function onMessage(msg, sender, respond) {
  if (msg.type !== CYCOMMAND) {
    return false;
  }

  const id = msg.id;
  let response = {
    id,
    type: CYRESPONSE,
    result: null,
    error: null,
    skipped: false,
  }

  /*
  Skip command if it has been executed before.

  Every single content script (ie. cy-inject.js) has a listener to window.message, if there're
  multiple iframes with all_frames=true the same script (cy-inject.js) will be injected to each
  iframe, resulting in executing the same op in background n times per n iframes, so we just skip
  the command for succesive content scripts if it's the same one.
  */
  if (skipCommand(id)) {
    // message sender expects a response, not responding will result in an error thrown
    // by the browser API
    response.skipped = true;
    return respond(response);
  }
  addCommand(msg);

  // Don't use async functions as listeners to chrome.runtime.onMessage, use Promise instead.
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
  execCommand(msg)
    .then(result => {
      response.result = result;
    })
    .catch(err => {
      response.error = {
        message: err.message,
        stack: err.stack,
      }
    })
    .finally(() => {
      respond(response);
    });
  // We return true so runtime.onmessage knows that this will be async. We can't use promises
  // directly here if we want the sendResponse() (a.k.a respond()) function to work.
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
  return true;
}

chrome.runtime.onMessage.addListener(onMessage);
// For ease of testing, clear storage and command log every time the tab is refreshed/opened
chrome.tabs.onUpdated.addListener(clearAll);
