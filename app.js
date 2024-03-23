const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/scrape', async (req, res) => {
  const linkedInProfileUrl = req.body.url;

  try {
    const response = await axios.get(linkedInProfileUrl);
    const $ = cheerio.load(response.data);

    const name = $('h1[class="text-heading-xlarge inline t-24 v-align-middle break-word"]').text();
    const headline = $('h2[class=" text-heading-large inline t-16 v-align-middle break-words"]').text();
    const location = $('span[class="text-body-small inline t-14 v-align-middle break-words"]').first().text();

    res.status(200).json({
      name,
      headline,
      location,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'An error occurred while scraping the LinkedIn profile',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;