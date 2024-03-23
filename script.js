const { LinkedInProfileScraper } = require('linkedin-profile-scraper');
const axios = require('axios');
const micro = require('node-micro');

const scraper = new LinkedInProfileScraper({
  keepAlive: true,
  logger: undefined,
});

scraper.on('fetch:end', async (response) => {
  if (response.error) {
    return console.error('Error:', response.error);
  }

  return response.content;
});

const app = micro({ name: 'LinkedIn Scraper' });

app.use(async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.json({
      error: 'A LinkedIn URL is required to fetch data.',
    });
  }

  const result = await scraper.run(`https://www.linkedin.com/in/${url.substring(url.lastIndexOf('/') + 1)}`);

  if (result.error) {
    return res.json({
      error: 'Error fetching data from LinkedIn.',
    });
  }

  return res.json(result.userProfile);
});

app.listen(8080, () => {console.log('Microservice is listening on port 8080.');
});

async function fetchLinkedInData(linkedInProfileUrl) {
    try {
      const response = await axios.get(`https://your-server-domain.com/?url=${linkedInProfileUrl}`);
      const data = response.data;
      console.log("here: ",data);
  
      if (data.error) {
        console.error(data.error);
      } else {
        console.log('Full Name:', data.fullName);
        console.log('Title:', data.title);
        console.log('Company:', data.currentCompany);
        console.log('Email:', data.email);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  fetchLinkedInData('someone');
scraper.run();