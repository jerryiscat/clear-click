// highlight the button
document.getElementById('highlightButton').addEventListener('click', function() {
    const keyword = document.getElementById('keywordInput').value;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'highlightButton', keyword: keyword });
    });
});

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

  recognition.onstart = function() {
    document.querySelectorAll('span').forEach(span => span.style.backgroundColor = '#C464FF');
    recognizing = true;
    micButton.style.backgroundColor = '#C464FF';
  };

  recognition.onerror = function(event) {
    console.error('Speech recognition error', event);
  };

  recognition.onend = function() {
    recognizing = false;
    micButton.style.backgroundColor = '';
    document.querySelectorAll('span').forEach(span => span.style.backgroundColor = 'white');
  };

  recognition.onresult = function(event) {
    clearTimeout(timeoutId);
    // let interim_transcript = '';
    // for (let i = event.resultIndex; i < event.results.length; ++i) {
    //   if (event.results[i].isFinal) {
    //     gptPrompt.value += event.results[i][0].transcript;
    //   } else {
    //     interim_transcript += event.results[i][0].transcript;
    //   }
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


// connect to chat gpt with the prompt 
document.getElementById('sendButton').addEventListener('click', function() {
    const promptText = document.getElementById('gptPrompt').value;
    const prompt = `Answer in english: ${promptText}`;
    console.log(prompt)
    fetch('http://localhost:3000/send-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt })
    })
    .then(response => response.text())
    .then(data => {
      console.log("data: " + data)

      document.getElementById('responseArea').innerText = data;
    })
    .catch(error => {
      console.error('Error:', error.message);
      document.getElementById('responseArea').innerText = 'Error: ' + error.message;
    });
  });
  

