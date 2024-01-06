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
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
      prompt: prompt,
    }, {
      headers: {
        'Authorization': `Bearer ${key}`
      }
    });
      console.log(response.data.choices[0]);
    res.json(response.data);
  } catch (error) {
    console.error('Error in calling OpenAI API:', error);
    res.status(500).send('Error processing your request');
  }
});
