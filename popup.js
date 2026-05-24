document.getElementById('countBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  status.textContent = 'Fetching active tab...';
  try {

    //hacer cosas con chrome.tabs.Tab.lastAccessed?: number | undefined;
    const tabs = await chrome.tabs.query({currentWindow: true});
    if(areTabsSorted(tabs)){
        status.textContent = 'Tabs are already sorted';
        return;
    }
    const groupedTabs = Object.groupBy(tabs,(tab) => tab.url ? getDomainAndTLD(tab.url) : "others")
    
    const sortedKeys = Object.keys(groupedTabs).sort()

    // puedo tener una whitelist de domains y crear un nuevo grupo de basura
    //  (tambien por chrome.tabs.Tab.lastAccessed o chrome.tabs.Tab.discarded)
    for (const key of sortedKeys) {
        // setteando MoveProperties.windowId puedo hacer una funcion para mergear todas las tabs que tenga 
        // abiertas de un hostname en para una ventan (con un max de tabs por window) 
        // o tambien puedo splittear si tengo mil tabsa en una sola window
        await chrome.tabs.move(groupedTabs[key].map((tab)=> tab.id),{index:-1}); 
    }
    // console.log({groupedTabs})



    status.textContent = tab ? tab.url : 'No active tab';
  } catch (err) {
    console.log(err);
    status.textContent = 'Error: ' + err.message;
  }
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


function getDomainAndTLD(url) {
  if (!url) return "zzz.zzz";
  const hostname = new URL(url).hostname;
  const parts = hostname.split(".");
  if (parts.length >= 2) {
    return parts.slice(-2).join(".");
  }
  return hostname;
}

function areTabsSorted(tabs) {
  for (let i = 1; i < tabs.length; i++) {
    const prevDomain = getDomainAndTLD(tabs[i - 1].url || "");
    const currDomain = getDomainAndTLD(tabs[i].url || "");
    if (prevDomain > currDomain) {
      return false;
    } 
  }
  return true;
}