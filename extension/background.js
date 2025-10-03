// background service worker (MV3)
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('BG received message', message);
  if (message && message.ping) sendResponse({ pong: true });
});
