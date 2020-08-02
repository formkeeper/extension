import i18nVars from "../../global/i18n";

/* global chrome */
const i18n = {
  get: (str, ...sub) => chrome.i18n.getMessage(str, sub),
  vars: i18nVars,
};

export default i18n;