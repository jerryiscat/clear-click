console.log("content.js is running");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("on Message is running")
    if (request.action === 'highlightButton') {
        console.log("is highlight")
        const keyword = request.keyword.toLowerCase();
        const buttons = document.querySelectorAll('button, a');

        let found = false;
      
        buttons.forEach(function(button) {
            if (button.textContent.toLowerCase().includes(keyword)) {
                console.log("anchor border:", button.style.border)
                button.style.border = '4px solid #C464FF';
                button.style.color = '#C464FF';
                found = true;
                console.log("found")
                console.log(button.textContent.toLowerCase())
            } 
        });

        if (!found) {
            console.log("No button or link found with the keyword.");
        }
    }
});

// chrome.tabs.executeScript(tabId, {file: "content.js"});

// handle click and update currentIndex
document.addEventListener('click', function(event) {
        console.log('Element clicked');
        console.log(event.target.textContent);

        let currentIndex = 0;
        let retrievedArray = [];
        let step = "";

        chrome.storage.local.get(['currentIndex', 'route'], function(result) {
            currentIndex = result.currentIndex; // Fallback to 0 if not found
            retrievedArray = result.route; // Fallback to empty array if not found
        
            console.log('Stored integer is ', currentIndex);
            console.log('Stored array is ', retrievedArray);
        
            step = retrievedArray[currentIndex];
            console.log(`Step ${currentIndex + 1}: ` + step);

            if (event.target.textContent.toLowerCase().includes(step)) {
                currentIndex++;
                chrome.storage.local.set({ currentIndex: currentIndex }, function() {
                  });
                console.log("After: ", currentIndex)
            }
        });


});
