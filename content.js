// Example content script that highlights the page title and listens for messages
(function () {
  const banner = document.createElement('div');
  banner.style.position = 'fixed';
  banner.style.left = '8px';
  banner.style.top = '8px';
  banner.style.padding = '6px 8px';
  banner.style.background = 'rgba(0,0,0,0.6)';
  banner.style.color = 'white';
  banner.style.zIndex = 999999;
  banner.style.borderRadius = '4px';
  banner.textContent = 'Extension content script injected';
  document.documentElement.appendChild(banner);

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.type === 'HIGHLIGHT') {
      document.body.style.outline = '4px solid ' + (msg.color || 'orange');
      sendResponse({ ok: true });
    }
  });
})();
