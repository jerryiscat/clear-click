document.getElementById('highlightButton').addEventListener('click', function() {
    const keyword = document.getElementById('keywordInput').value;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'highlightButton', keyword: keyword });
    });
});
