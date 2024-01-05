const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());

app.use(cors({
    origin: 'http://localhost:3000' // Replace with the URL of your web page
  }));


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log(OPENAI_API_KEY)

app.post('/send-prompt', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
      prompt: prompt,
      max_tokens: 10
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });
    

    res.json(response.data);
  } catch (error) {
    console.error('Error in calling OpenAI API:', error);
    res.status(500).send('Error processing your request');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
