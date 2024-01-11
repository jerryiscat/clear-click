// 1 with background.js
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log("content.js is running");
//     if (request.action === 'highlightButton') {
//         console.log("is highlight");
//         const buttons = document.querySelectorAll('button, a');

//         buttons.forEach(function(button) {
//             const buttonText = button.textContent.toLowerCase();
//             const currentStep = route[currentIndex].toLowerCase();

//             if (buttonText.includes(currentStep)) {
//                 console.log("anchor border:", button.style.border);
//                 button.style.border = '4px solid #C464FF';
//                 button.style.color = '#C464FF';

//                 // Send a message to the background script to increment currentIndex
//                 chrome.runtime.sendMessage({ action: 'incrementIndex' });
//                 console.log("Found and highlighted:", buttonText);
//             }
//         });
//     }
//     if (request.action === 'getRoute') {
//         console.log("route recording");
//         const route = response.route || [];
//         console.log("content.js is indeed running");
//         console.log("Current route:", route);
//     }
// });


// extra
// chrome.runtime.sendMessage({ action: 'getRoute' }, function(response) {
//     const route = response.route || [];
//     console.log("content.js is indeed running");
//     console.log("Current route:", route);
//     //sendResponse({ success: true, message: 'Path successfully recorded' });
// });


// 2 without background.js !! current working one
// console.log("content.js is running");

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log("on Message is running")
//     if (request.action === 'highlightButton') {
//         console.log("is highlight")
//         const keyword = request.route[1].toLowerCase();
//         const buttons = document.querySelectorAll('button, a');

//         let found = false;
      
//         buttons.forEach(function(button) {
//             if (button.textContent.toLowerCase().includes(keyword)) {
//                 console.log("anchor border:", button.style.border)
//                 button.style.border = '4px solid #C464FF';
//                 button.style.color = '#C464FF';
//                 found = true;
//                 console.log("found")
//                 console.log(button.textContent.toLowerCase())
//             } 
//         });

//         if (!found) {
//             console.log("No button or link found with the keyword.");
//         }
//     }
//     if (request.action === 'getRoute') {
//         console.log("route recording");
//         const route = response.route || [];
//         console.log("content.js is indeed running");
//         console.log("Current route:", route);
//     }
// });

// // chrome.tabs.executeScript(tabId, {file: "content.js"});

// // handle click and update currentIndex
// document.addEventListener('click', function(event) {
//         console.log('Element clicked');
//         console.log(event.target.textContent);

//         let currentIndex = 0;
//         let retrievedArray = [];
//         let step = "";

//         chrome.storage.local.get(['currentIndex', 'route'], function(result) {
//             currentIndex = result.currentIndex; // Fallback to 0 if not found
//             retrievedArray = result.route; // Fallback to empty array if not found
        
//             console.log('Stored integer is ', currentIndex);
//             console.log('Stored array is ', retrievedArray);
        
//             step = retrievedArray[currentIndex];
//             console.log(`Step ${currentIndex + 1}: ` + step);

//             if (event.target.textContent.toLowerCase().includes(step)) {
//                 currentIndex++;
//                 chrome.storage.local.set({ currentIndex: currentIndex }, function() {
//                   });
//                 console.log("After: ", currentIndex)
//             }
//         });

// });


// 3 with background.js
console.log("content.js is running");

// document.addEventListener('click', function(event) {
//     chrome.runtime.sendMessage({ action: 'incrementIndex' });
// });

document.addEventListener('click', function(event) {
    console.log('Click event intercepted');
    event.preventDefault();
    console.log('Link clicked. Delaying navigation.');
    setTimeout(function() {
        window.location.href = event.target.href;
        chrome.runtime.sendMessage({ action: 'incrementIndex' }, function(response) {
            console.log('click increamented send to background.js');
        });
    }, 100);
}, true);

// document.addEventListener('DOMContentLoaded', function() {
//     // Get all buttons and links on the current webpage
//     buttons = document.querySelectorAll('button, a');
//     //const buttonText = button.textContent.toLowerCase();
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //window.location.reload();
    if (request.action === 'highlightButton') {
        console.log("is highlighting");
        const keyword = request.keyword.toLowerCase();
        const buttons = document.querySelectorAll('button, a');
        console.log("current keyword: " + keyword);
        console.log(window.location.href);
        //console.log(document.documentURI);
        //console.log(buttons);
        buttons.forEach(function(button) {
            const buttonText = button.textContent.toLowerCase();
            //console.log(buttonText);
            if (buttonText.includes(keyword)) {
                console.log("anchor border:", button.style.border);
                button.style.border = '4px solid #C464FF';
                button.style.color = '#C464FF';
            }
        });
    } else if (request.action === 'getRoute') {
        console.log("is getting route");
        const route = request.route || [];

        chrome.runtime.sendMessage({ action: 'setRoute', route: route }, function(response) {
            if (response.success) {
                console.log('Route set successfully in background.js');
            } else {
                console.error('Error setting route in background.js');
            }
        });
    }
});


// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === 'executeContentScript') {
//         chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//             console.log("content.js is indeed running");
//             if (request.action === 'highlightButton') {
//                 console.log("is highlighting");
//                 const currentDocument = document;
//                 const keyword = request.keyword.toLowerCase();
//                 const buttons = currentDocument.querySelectorAll('button, a');
//                 console.log("current keyword: " + keyword);
//                 buttons.forEach(function(button) {
//                     const buttonText = button.textContent.toLowerCase();
//                     console.log(buttonText);
//                     if (buttonText.includes(keyword)) {
//                         console.log("anchor border:", button.style.border);
//                         button.style.border = '4px solid #C464FF';
//                         button.style.color = '#C464FF';
//                     }
//                 });
//             } if (request.action === 'getRoute') {
//                 console.log("is getting route");
//                 const route = request.route || [];
        
//                 chrome.runtime.sendMessage({ action: 'setRoute', route: route }, function(response) {
//                     if (response.success) {
//                         console.log('Route set successfully in background.js');
//                     } else {
//                         console.error('Error setting route in background.js');
//                     }
//                 });
//             }
//         });

//     }
// });