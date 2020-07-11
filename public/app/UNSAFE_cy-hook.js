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

function resolveTarget(propPath, top) {
  return propPath
    .split(".")
    .reduce((accObj, nextKey) => accObj[nextKey], top);
}

async function execCommand({target}) {
  const { propertyPath, method, args } = target;
  const targetObj = resolveTarget(propertyPath, chrome);

  if (!method) {
    return targetObj;
  }

  try {
    return await targetObj[method].apply(targetObj, args);
  } catch(err) {
    throw err;
  }
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

function onMessage(msg, sender, respond) {
  if (msg.type !== CYCOMMAND) {
    return false;
  }

  let response = {
    type: CYRESPONSE,
    result: null,
    error: null,
  }

  // Don't use async functions as listeners to chrome.runtime.onMessage, use Promise instead.
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
  execCommand(msg)
    .then(result => {
      response.result = result;
      respond(response);
    })
    .catch(err => {
      response.error = err;
      respond(response);
    });
  // We return true so runtime.onmessage knows that this will be async. We can't use promises
  // directly here if we want the sendResponse() (a.k.a respond()) function to work.
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
  return true;
}

chrome.runtime.onMessage.addListener(onMessage);