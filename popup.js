import { sortTabs } from "./actions.js";

let GARBAGE_GROUP_ID = null;
const GARBAGE_GROUP_TITLE = "Basura";
const THREE_HOURS_IN_MS = 3 * 60 * 60 * 1000;


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
    if(tab.lastAccessed && (Date.now() - tab.lastAccessed ) > THREE_HOURS_IN_MS && tab.id ){
      console.log({lastAccessed: tab.lastAccessed})
      garbageTabIds.push(tab.id)
      console.log(`Tab ${tab.id} is garbage - tab.lastAccessed: ${tab.lastAccessed} - now: ${Date.now()}`)
    }
  })
  console.log(`Garbage tab IDs: ${garbageTabIds.join(', ')}`);
  if (garbageTabIds.length === 0) {
    console.log('No garbage tabs found');
    return;
  }
  if(GARBAGE_GROUP_ID === null){
    const groupId = await chrome.tabs.group({tabIds: garbageTabIds});
    GARBAGE_GROUP_ID = groupId;
    await chrome.tabGroups.update(GARBAGE_GROUP_ID, {title: GARBAGE_GROUP_TITLE, color: 'grey'});
  } else {
    await chrome.tabs.group({groupId: GARBAGE_GROUP_ID ,tabIds: garbageTabIds})
  }
  console.log({GARBAGE_GROUP_ID})
});


