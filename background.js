let currentIndex = 0;
let route = []; 

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'incrementIndex') {
        currentIndex++;
        console.log("currentIndex incremented to", currentIndex);
    } else if (request.action === 'setRoute') {
        route = request.route;
        currentIndex = 0;  // Reset currentIndex when setting a new route
        console.log("Route set:", route);
    } else if (request.action === 'getRoute') {
        sendResponse({ route: route });
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