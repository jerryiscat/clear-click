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

import OpenAI from "openai";

const openai = new OpenAI();


app.post('/send-prompt', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const response = await openai.chat.completions.create ({
      messages: [{ role: "system", content: "You are a helpful website navigator." }],
      model: "gpt-3.5-turbo",
      prompt: prompt,
    }, {
      headers: {
        'Authorization': `Bearer ${'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'}`
      }
    });
    console.log(response.choices[0])
    console.log(response.data)

    res.json(response.data);
  } catch (error) {
    console.error('Error in calling OpenAI API:', error.message);
    res.status(500).send('Error processing your request');
  }
});
