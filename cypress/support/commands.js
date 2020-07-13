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

function id() {
  const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return btoa(id);
}


/*
  createResponseListener takes a `onCyResponseCb([resolve, reject], evt)` to be invoked after some common listener
  assertions and returns the wrapped listener function
*/
function createResponseListener(onCyResponseCb) {
  return function assertionsWrapper([resolve, reject], evt) {
    if (!evt.data) {
      return false;
    }

    const { error, type } = evt.data;
    if (type !== CYRESPONSE) {
      return false;
    }

    if (error) {
      let err = new Error(error.message);
      err.stack = error.stack;
      return reject(err)
    }

    onCyResponseCb.call(this, [resolve, reject], evt);
  }
}

function addExtensionCommand(commandName, commandFuncFactory) {
  Cypress.Commands.add(commandName, function commandWrapper(...args) {
    const { target, onCyResponseCb } = commandFuncFactory.apply(this, args);
    return new Promise((resolve, reject) => {
      win.postMessage({
      type: CYCOMMAND,
      id: id(),
      target,
      });

      listenerWithTimeout(
        [win, "message"],
        createResponseListener(onCyResponseCb),
        3e3
      ).then(result => resolve(result))
      .catch(reject)
    });
  });
}

const extensionCommands = {
  "getLocalExtensionStorage": key => {
    function onCyResponseCb([resolve, reject], evt) {
      const { result } = evt.data;
      if (result && Object.keys(result).length > 0) {
        Cypress.log({
          name: `getLocalExtensionStorage('${key}')`,
          message: `Got result -> {${key}: ${result[key]}}`,
        })
        return resolve(result)
      }
      Cypress.log({
        name: `getLocalExtensionStorage('${key}')`,
        message: `No result found for key ${key}`
      })
      return resolve(false);
    }

    return {
      target: {
        propertyPath: "storage.local",
        method: "get",
        methodType: METHOD_TYPE.CALLBACK,
        args: [key],
      },
      onCyResponseCb,
    }
  },

  "setLocalExtensionStorage": (key, value) => {
    function onCyResponseCb([resolve, reject], evt) {
      // storage.set doesn't return results if succeeded so we just resolve (pass test)
      // if a CYRESPONSE is received.
      resolve(null);
    }

    return {
      target: {
        propertyPath: "storage.local",
        method: "set",
        methodType: METHOD_TYPE.CALLBACK,
        args: [{[key]: value}],
      },
      onCyResponseCb,
    }
  },

  "clearLocalExtensionStorage": () => {
    function onCyResponseCb([resolve, reject], evt) {
      // storage.clear doesn't return results if succeeded so we just resolve (pass test)
      // if a CYRESPONSE is received.
      resolve(null);
    }

    return {
      target: {
        propertyPath: "storage.local",
        method: "clear",
        methodType: METHOD_TYPE.CALLBACK,
        args: [],
      },
      onCyResponseCb,
    }
  }
}

Object.keys(extensionCommands).forEach((commandName) => {
  addExtensionCommand(commandName, extensionCommands[commandName]);
})