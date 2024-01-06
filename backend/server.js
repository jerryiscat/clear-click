const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

const website = "washington government website";

require('dotenv').config();


app.use(bodyParser.json());

app.use(express.static('public'));

const cors = require('cors');
const fs = require('fs');

// Read the JSON file
const jsonData = fs.readFileSync('map.json', 'utf8');
const parsedData = JSON.parse(jsonData);
let mappings;
for (const entry of parsedData) {
  if (entry.website === website) {
    mappings = entry.mappings;
    console.log("Successfully found mapping for", website);
    break; // Stop searching once a match is found
  }
}
if (!mappings) {
  console.log("No mappings found for the specified website:", website);
}

app.use(cors((req, callback) => {
  let corsOptions;
  const allowedOrigins = ['http://localhost:3000', 'chrome-extension:'];
  if (allowedOrigins.includes(req.header('Origin'))) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false }; 
  }
  callback(null, corsOptions);
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const key = process.env.OPENAI_API_KEY;

app.post('/send-prompt', async (req, res) => {
  let keyIndex = 0;
  let prompt = "You are a helpful assistant for website navigation. Assuming you";
  prompt += " are inside " + website + " webiste, given the following tasks options: ";
  mappings.forEach(mapping => {
    const functionValue = mapping.function;
    prompt += "\n" + keyIndex + ": ";
    prompt += "" + functionValue + ", ";
    keyIndex++;
  });
  prompt += ". Try to determine which of the options the following prompt trying to achieve, ";
  prompt += "Please choose the option by only entering the index number ";
  const options = "(" + generateNumberString(keyIndex) + "). And without explanation.";
  prompt += options + "if the prompt is unclear or you couldn't decide which option it belongs, "
  prompt += "please output: \"Your input is unclear, please re-enter your input\"";
  prompt += "The prompt is following: " + req.body.prompt + ". ";
  console.log("n = " + keyIndex);
  try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', 
          {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  model: "gpt-3.5-turbo",

                  // max_tokens: 200,
                  messages: [
                      { "role": "system", "content": "You are a helpful assistant." },
                      { "role": "user", "content":  prompt }
                  ]
              }),
          });
        
      const data = await response.json();
      const apiResponse = data.choices[0].message.content;
      
      console.log(apiResponse);
      
      if (apiResponse.indexOf("re-enter") !== -1) {
        //console.log(1);
        res.send(apiResponse);
        
      } else {
        //console.log(2);
        const firstChar = apiResponse[0];
        const result = parseInt(firstChar, 10);
        console.log(result);
        const path = mappings[result].path;
        console.log(path);
        res.send(path);
      }
  } catch (error) {
    console.error('Error in calling OpenAI API:', error.message);
    res.status(500).send('Error processing your request');
  }
});

function generateNumberString(n) {
  let result = "";
  for (let i = 0; i < n; i++) {
    result += i + ", ";
  }
  // Remove the trailing comma and space
  return result.slice(0, -2);
}
