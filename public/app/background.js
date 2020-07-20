/* global chrome */
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, {
    "type": "on_badge_click"
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  const url = changeInfo.url;
  if (url) {
    chrome.tabs.sendMessage(tabId, {
      "type": "on_url_updated",
      url
    });
  }
});
