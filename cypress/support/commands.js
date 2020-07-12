// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const CYCOMMAND = "cy-command";
const CYRESPONSE = "cy-response";
const METHOD_TYPE = {
  PROMISE: "method-type-promise",
  CALLBACK: "method-type-callback",
}
const win = window.top;

function listenerWithTimeout([obj, eventName], listener, timeout) {
  return new Promise((resolve, reject) => {
    const wrapper = (...args) =>
      listener.call(this, [resolve, reject], ...args)
    obj.addEventListener(eventName, wrapper);

    setTimeout(() => {
      obj.removeEventListener(eventName, wrapper);
      reject(new Error(`${listener.name}(): Timeout exceeded while awaiting for resolve on ${obj}.on${eventName}`))
    }, timeout);
  });
}

function onResponseListener([resolve, reject], evt) {
  if (!evt.data) {
    return false;
  }

  const { error, type, result } = evt.data;
  if (type !== CYRESPONSE) {
    return false;
  }

  if (error) {
    let err = new Error(error.message);
    err.stack = error.stack;
    return reject(err)
  }

  if (Object.keys(result).length > 0) {
    Cypress.log(result)
    return resolve(result)
  }
  reject(new Error("No result found for key"));
}

Cypress.Commands.add("getLocalExtensionStorage", key => {
  return new Promise((resolve, reject) => {
    win.postMessage({
    type: CYCOMMAND,
    target: {
      propertyPath: "storage.local",
      method: "get",
      methodType: METHOD_TYPE.CALLBACK,
      args: [key],
      },
    });

    listenerWithTimeout([win, "message"], onResponseListener, 3e3)
    .then(result => resolve(result))
    .catch(reject)
  });
});

Cypress.Commands.add("setLocalExtensionStorage", (key, value) => {
  return new Promise((resolve, reject) => {
    win.postMessage({
      type: CYCOMMAND,
      target: {
        propertyPath: "storage.local",
        method: "set",
        methodType: METHOD_TYPE.CALLBACK,
        args: [key, value],
      },
    });

    listenerWithTimeout([win, "message"], onResponseListener, 3e3)
    .then(result => resolve(result))
    .catch(reject)
  });
});