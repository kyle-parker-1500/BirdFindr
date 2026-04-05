import express from 'express';
const app = express();
const API_KEY = "m2feoh137j46";

app.set("view engine", "ejs");
app.use(express.static("public"));

// 4 routes
// 1: / -> root displays top 100 birds in CA
// 2: /region -> displays dropdown with regions to choose from & displays top 100
// 3: /search -> search species of bird (idk)
// 4: /

// display recent sightings in US-CA (region code for ca)
app.get('/', async (req, res) => {
   let url = `https://api.ebird.org/v2/product/top100/US-CA/2026/01/01`;
   const response = await fetch(url, {
      method: 'GET',
      headers: {
         'X-ebirdapitoken': API_KEY,
      }
   });
   const data = await response.json();
   console.log("Getting data: ", data);
   res.render('home.ejs', { data: data });
});

app.post('/', (req, res) => {

});

app.listen(3000, () => {
   console.log('server started');
});