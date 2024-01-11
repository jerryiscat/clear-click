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
      //document.getElementById('responseArea').innerText = data;


      let newHtml = "<ul style='margin-left: 0px;'>"; // Add margin-left style to the unordered list

      route.forEach((value, index) => {
          newHtml += `<li>Step ${index + 1}: ${value}</li>`;
      });

      newHtml += "</ul>";

      // Assuming responseArea is an HTML element, set its innerHTML to the new HTML
      document.getElementById('responseArea').innerHTML = newHtml;
      let link = document.getElementById('myLink');
      link.href = 'https://ecology.wa.gov/Waste-Toxics/Business-waste';
      link.style.display = 'block';
    })
    .catch(error => {
      console.error('Error:', error.message);
      document.getElementById('responseArea').innerText = "Your input is unclear, please re-enter your input.";
      let link = document.getElementById('myLink');
      link.style.display = 'none';
    });


    chrome.storage.local.set({ currentIndex: 0 }, function() {
      console.log('Value is set to', 0);
    });

    chrome.storage.local.set({ route: route }, function() {
      console.log('route is set to', route);
    });
    
  //   chrome.runtime.sendMessage({ action: 'setRoute', route: route }, function(response) {
  //     try {
  //         if (chrome.runtime.lastError) {
  //             console.error('Error in sending message:', chrome.runtime.lastError);
  //         } else if (response && response.success) {
  //             console.log('Route set successfully');
  //         } else {
  //             console.error('Error setting route');
  //         }
  //     } catch (error) {
  //         console.error('An error occurred:', error);
  //     }
  // });

    chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
        await chrome.tabs.sendMessage(tabs[0].id, { action: 'getRoute', route: route });
    });

    // chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    //   await chrome.tabs.sendMessage(tabs[0].id, { action: 'highlightButton', route: route });
    // });

  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     const tabId = tabs[0].id;
  
  //     chrome.tabs.sendMessage(tabId, { action: 'getRoute', route: route }, function (response) {
  //         console.log("1111");
  //         console.log(response);
  //         console.log("2222");
  
  //         // Handle the response if needed
  //         if (chrome.runtime.lastError) {
  //             console.error("Error in sending message:", chrome.runtime.lastError);
  //         } else if (response && response.success) {
  //             console.log("Button highlighted successfully");
  //         } else {
  //             console.error("An error occurred while highlighting the button");
  //         }
  //     });
  // });


//   // executeScript, without manifest.
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     const tabId = tabs[0].id;
  
//     chrome.scripting.executeScript({
//         target: { tabId: tabId },
//         function: function () {
//             // Your content script logic goes here
//             console.log("1111");

//             chrome.runtime.sendMessage({ action: 'getRoute', route: route }, function (response) {
//                 console.log("2222");
//                 console.log(response);

//                 // Handle the response if needed
//                 if (chrome.runtime.lastError) {
//                     console.error("Error in sending message:", chrome.runtime.lastError);
//                 } else if (response && response.success) {
//                     console.log("Button highlighted successfully");
//                 } else {
//                     console.error("An error occurred while highlighting the button");
//                 }
//             });
//         },
//     });
// });



    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   const tabId = tabs[0].id;
    //   console.log("1111");
    //   chrome.tabs.sendMessage(tabId, { action: 'getRoute', route: route });
    //   if (chrome.runtime.lastError) {
    //     console.error("Error in sending message:", chrome.runtime.lastError);
    //   }
    //   console.log("2222");
    // });


});


    // var testButton = document.getElementById('test-button');
    // if (testButton.style.border === '4px solid #C464FF') {
    //     testButton.style.border = ''; // Revert to original or specify a different style
    // } else {
    //     testButton.style.border = '4px solid #C464FF';
    // }
//});

// document.getElementById('test-button').addEventListener('click', function() {
//   var testButton = document.getElementById('test-button');
//   testButton.style.border = '';

//   chrome.storage.local.get(['currentIndex', 'route'], function(result) {
//       currentIndex = result.currentIndex || 0; 
//       retrievedArray = result.route; 
//       console.log("index: ", currentIndex);
//       console.log(retrievedArray);
//   });
// });
  

