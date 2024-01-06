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
