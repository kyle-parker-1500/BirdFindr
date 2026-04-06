import express from 'express';
const app = express();
const API_KEY = "m2feoh137j46";

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// 4 routes
// 1: / -> root displays top 100 birds in CA
// 2: /region -> displays dropdown with regions to choose from & displays top 100
// 3: /display -> displays findings in the region based on a date
// 4: /

let globalUserInput;

// display top 100 sightings in US-CA (region code for ca)
app.get('/', async (req, res) => {
   let url = `https://api.ebird.org/v2/product/top100/US-CA/2026/01/01`;
   try {
      const response = await fetch(url, {
         method: 'GET',
         headers: {
            'X-ebirdapitoken': API_KEY,
         }
      });
      const data = await response.json();
      res.render('home.ejs', { data: data });
   } catch(err) {
      console.error("Error accessing API endpoint: ", err);
   }
});

// get default dropdown info
app.get('/region', async (req, res) => {
   // default values set
   let scope = {
      'country': `https://api.ebird.org/v2/ref/region/list/country/world`,
   };
   let settings = {
      method: 'GET',
      headers: {
         'X-ebirdapitoken': API_KEY
      }
   };

   try {
      const response = await fetch(scope.country, settings);
      const data = await response.json();
      
      res.render('region.ejs', { countryData: data });
   } catch (err) {
      console.error("Error accessing API endpoint: ", err);
   }
});

app.get('/region/:info', async (req, res) => {
   const { info } = req.params;
   let url = `https://api.ebird.org/v2/ref/region/list/subnational1/${info}`;
   try {
      const response = await fetch(url, {
      method: 'GET',
         headers: {
            'X-ebirdapitoken': API_KEY
         }
      });
      const data = await response.json();
      res.json(data);
   } catch (err) {
      console.error("Error posting to frontend: ", err);
   }
});

app.get('/submit/:info', async (req, res) => {
   const { info } = req.params;
   // redirects info to other routes   
   globalUserInput = info; 
   res.redirect(`/around-me?info=${info}`);
});

// around me page
app.get('/around-me', async (req, res) => {
   let userInput;
   if (req.query.info != (undefined || null)) {
      userInput = req.query.info; 
   }
   let settings = {
      method: 'GET',
      headers: {
         'X-ebirdapitoken': API_KEY
      }
   };
   
   let url = `https://api.ebird.org/v2/data/obs/${userInput || 'US-CA'}/recent/notable?detail=full`
   try {
      const response = await fetch(url, settings);
      const data = await response.json();
      res.render('viewRegion.ejs', { birdData: data });
   } catch (err) {
      console.error("Error accessing API endpoint: ", err);
   } 
});

app.get('/recent-observations', async (req, res) => {
   let userInput;
   if (globalUserInput != (undefined || null)) {
      userInput = globalUserInput;
   }
   let url = `https://api.ebird.org/v2/product/lists/${userInput || 'US-CA'}/2026/01/21`;
   try {
      const response = await fetch(url, {
         method: 'GET',
         headers: {
            'X-ebirdapitoken': API_KEY
         }
      });
      const data = await response.json();
      res.render('dateView.ejs', { birdData: data });
   } catch (err) {
      console.error("Error accessing API endpoint: ", err);
   }
});

app.get('/submit-date', async (req, res) => {
   let userInput;
   let day, year, month;
   if (globalUserInput != (undefined || null)) {
      userInput = globalUserInput;
   }
   if (req.query != (undefined || null)) {
      day = req.query.day;
      month = req.query.month;
      year = req.query.year;
   }
   
   let settings = {
      method: 'GET',
      headers: {
         'X-ebirdapitoken': API_KEY
      }
   };
   
   let url = `https://api.ebird.org/v2/product/lists/${userInput || 'US-CA'}/${year || '2026'}/${month || '01'}/${day || '01'}`;
   try {
      const response = await fetch(url, settings);
      const data = await response.json();
      res.json(data);
   } catch (err) {
      console.error("Error accessing API endpoint: ", err);
   }
});

app.listen(3000, () => {
   console.log('server started');
});