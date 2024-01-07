console.log("Content script is running!");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'check_injected') {
      // Content script is injected, send a response
      sendResponse({ injected: true });
    } else if (request.action === 'test_message') {
      console.log('Received test message in content script!');
      // Perform any other actions you want to do in response to the message
    }
    sendResponse({ success: true, message: 'Button highlighted successfully' });
  });