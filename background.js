let currentIndex = 0;
let route = []; 
console.log("background.js is running");

// chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
//   //if (details.transitionType === 'typed'){
//     currentIndex++;
//     console.log("currentIndex incremented to", currentIndex);
//     const keyword = route[currentIndex];
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, { action: 'highlightButton', keyword: keyword});
//     });
//   //}
// });
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   if (changeInfo.status === 'complete') {
//       console.log('Page loaded completely. Triggering content script.');

//       chrome.tabs.sendMessage(tabId, { action: 'executeContentScript' });
//   }
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'incrementIndex') {
    console.log("Current route:", route);
    chrome.storage.local.get(['route', 'currentIndex'], function(data) {
      chrome.alarms.create('delayedAction', { delayInMinutes: 1 });
      const route = data.route || [];
      let currentIndex = data.currentIndex || 0;

      console.log("Current route:", route);
      currentIndex++;
      console.log("currentIndex incremented to", currentIndex);
      let keyword = route[currentIndex];
      console.log("Current keyword:", keyword);
      //chrome.tabs.reload();
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'highlightButton', keyword: keyword });
      });

      chrome.storage.local.set({ currentIndex: currentIndex }, function() {
        console.log('currentIndex updated in Chrome storage');
      });
    });
  } else if (request.action === 'setRoute') {
    let currentIndex = 0;
    const route = request.route || [];
    let keyword = route[currentIndex];
    console.log("background.js is indeed running");
    console.log("Current route:", route);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'highlightButton', keyword: keyword});
    });
    chrome.storage.local.set({ route: route, currentIndex: currentIndex }, function() {
      console.log('Route and currentIndex set in Chrome storage');
    });
    chrome.storage.local.get(['route', 'currentIndex'], function(data) {
      console.log('Retrieved data from Chrome storage:', data);
    });
    sendResponse({ success: true, message: 'Route set successfully in background.js' });
  }
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'check_injected') {
//     console.log('recived check_injected test');
//     // Content script is injected, send a response
//     sendResponse({ injected: true });
//   } else if (request.action === 'test_message') {
//     console.log('Received test message in service worker!');
//     // Perform any other actions you want to do in response to the message
//   }
// });