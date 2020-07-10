// IMPORTANT NOTE: Intended for testing purposes, this file will be auto. removed in prod builds. It's also
// insecure as it exposes hooks to WebExtensions API and it will execute, in the same context that the extension
// being developed, any WebExtension API (chrome API) command sent by window.postMessage.
//
// If included in production, untrusted websites could have the equivalent privileges of installing an extension,
// with the same permissions that this one, on the browser of the users of this extension.