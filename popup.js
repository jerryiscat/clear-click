// highlight the button
// document.getElementById('highlightButton').addEventListener('click', function() {
//     const keyword = document.getElementById('keywordInput').value;
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, { action: 'highlightButton', keyword: keyword });
//     });
// });

// handle click and update currentIndex
document.addEventListener('click', function(event) {
        console.log(event.target.textContent);
        if (event.target.textContent.toLowerCase().includes("test button")) {
            var currentStoredIndex = parseInt(localStorage.getItem('currentIndex')) || 0;
            var newCurrentIndex = currentStoredIndex + 1;
            localStorage.setItem('currentIndex', newCurrentIndex.toString());
            console.log(localStorage.getItem('currentIndex'));
            //call highlight
        }
});

document.getElementById('startNavigate').addEventListener('click', function() {
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
document.getElementById('startNavigate').addEventListener('click', function() {
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
  

