// audio to text function
const micButton = document.getElementById('micButton');
const gptPrompt = document.getElementById('gptPrompt');
let recognizing = false;
let timeoutId;

if (!('webkitSpeechRecognition' in window)) {
  alert("Your browser doesn't support speech recognition. Try Chrome.");
} else {
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = function() {
    document.querySelectorAll('span').forEach(span => span.style.backgroundColor = '#C464FF');
    recognizing = true;
    myData = "Listening";
  };

  recognition.onerror = function(event) {
    console.error('Speech recognition error', event);
    myData = "";
  };

  recognition.onend = function() {
    recognizing = false;
    micButton.style.backgroundColor = '';
    document.querySelectorAll('span').forEach(span => span.style.backgroundColor = 'white');
  };

  recognition.onresult = function(event) {
    clearTimeout(timeoutId);
    gptPrompt.value = event.results[0][0].transcript;
    timeoutId = setTimeout(function() {
      if (recognizing) {
        recognition.stop();
      }
    }, 2000);
  };

    //gptPrompt.value += interim_transcript;

micButton.onclick = function() {
    if (recognizing) {
      recognition.stop();
      return;
    }
    recognition.start();
  };
}

let route = [];
// connect to chat gpt with the prompt 
document.getElementById('startNavigate').addEventListener('click', async function() {
    const promptText = document.getElementById('gptPrompt').value;
    const prompt = `Answer in english: ${promptText}`;
    console.log(prompt)
    await fetch('http://localhost:3000/send-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt })
    })
    .then(response => response.json())
    .then(data => {
      route = data
      document.getElementById('responseArea').innerText = data;
    })
    .catch(error => {
      console.error('Error:', error.message);
      document.getElementById('responseArea').innerText = "Your input is unclear, please re-enter your input.";
    });


    chrome.storage.local.set({ currentIndex: 0 }, function() {
      console.log('Value is set to', 0);
    });

    chrome.storage.local.set({ route: route }, function() {
      console.log('route is set to', route);
    });
    

    const firstStep = route[0];
    console.log(firstStep);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'highlightButton', keyword: firstStep });
    });

    var testButton = document.getElementById('test-button');
    if (testButton.style.border === '4px solid #C464FF') {
        testButton.style.border = ''; // Revert to original or specify a different style
    } else {
        testButton.style.border = '4px solid #C464FF';
    }
});

document.getElementById('test-button').addEventListener('click', function() {
  var testButton = document.getElementById('test-button');
  testButton.style.border = '';

  chrome.storage.local.get(['currentIndex', 'route'], function(result) {
      currentIndex = result.currentIndex || 0; 
      retrievedArray = result.route; 
      console.log("index: ", currentIndex);
      console.log(retrievedArray);
  });
});
  

