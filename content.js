chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'highlightButton') {
        const keyword = request.keyword.toLowerCase();
        const buttons = document.querySelectorAll('button, a');
      
        buttons.forEach(function(button) {
            if (button.textContent.toLowerCase().includes(keyword)) {
            button.style.border = '4px solid #C464FF';
            } else {
            button.style.border = 'none';
            }
        });
    }
});

// chrome.tabs.executeScript(tabId, {file: "content.js"});

// handle click and update currentIndex
document.addEventListener('click', function(event) {
        console.log('Element clicked');
        console.log(event.target.textContent);
        let currentIndex= parseInt(localStorage.getItem('currentIndex')) || 0;
        console.log("before: "+localStorage.getItem('currentIndex'))
        let retrievedArray = JSON.parse(localStorage.getItem('route')) || [];
        const step = retrievedArray[currentIndex]

        currentIndex++;
        localStorage.setItem('currentIndex', currentIndex.toString());
        console.log("After: "+currentIndex)

        if (event.target.textContent.toLowerCase().includes("menu")) {
            currentIndex++;
            localStorage.setItem('currentIndex', currentIndex.toString());
            console.log("After: "+currentIndex)
        }

        // if (event.target.textContent.toLowerCase().includes("menu")) {
        //     var currentStoredIndex = parseInt(localStorage.getItem('currentIndex')) || 0;
        //     var newCurrentIndex = currentStoredIndex + 1;
        //     localStorage.setItem('currentIndex', newCurrentIndex.toString());
        //     console.log(localStorage.getItem('currentIndex'));
        //     //call highlight
        // }

});
