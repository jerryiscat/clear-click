const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
require('dotenv').config();


app.use(bodyParser.json());

app.use(express.static('public'));

const cors = require('cors');

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

const key = process.env.OPENAI_API_KE

app.post('/send-prompt', async (req, res) => {
  const prompt = req.body.prompt;
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
      console.log(data.choices[0].message.content);
      
      res.send(data.choices[0].message.content);
  } catch (error) {
    console.error('Error in calling OpenAI API:', error.message);
    res.status(500).send('Error processing your request');
  }
});
