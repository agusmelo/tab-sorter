const colorInput = document.getElementById('color');
const message = document.getElementById('message');

async function saveOptions() {
  const color = colorInput.value || '';
  await chrome.storage.sync.set({ favoriteColor: color });
  message.textContent = 'Options saved.';
}

async function restoreOptions() {
  const data = await chrome.storage.sync.get(['favoriteColor']);
  colorInput.value = data.favoriteColor || '';
  message.textContent = 'Options restored.';
}

document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('restore').addEventListener('click', restoreOptions);

// restore on load
restoreOptions();
