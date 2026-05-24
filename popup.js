import { sortTabs } from "./actions.js";

document.getElementById('countBtn').addEventListener('click', async ()=>{
  const status = document.getElementById('status');
  status.textContent = 'Fetching active tab...'; 
  const sortStatus = await sortTabs();
  status.textContent = sortStatus.message;
});

document.getElementById('garbageBtn').addEventListener('click', async () => {
  const tabs = await chrome.tabs.query({currentWindow: true});
  const garbageTabIds = []
  tabs.forEach((tab)=>{
    if(tab.lastAccessed && (tab.lastAccessed - Date.now()) > 36000000 && tab.id ){
      console.log({lastAccessed: tab.lastAccessed})
      garbageTabIds.push(tab.id)
    }
  })
  chrome.tabs.group({tabIds: garbageTabIds})
  console.log({garbageTabIds})
});


