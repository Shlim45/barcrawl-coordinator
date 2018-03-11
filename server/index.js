require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const helpers = require('./modules');

const PORT = 8081 || process.env.PORT;

app.use(cors());

app.get('/', function(req, res) {
    res.json({message: "Make a GET request to /api/search to search"});
});

app.get('/api/search', function(req, res) {
    const { term, location } = req.query;
    
    helpers.yelpSearch(term, location)
      .then(data => res.json(data)) // do checking of res.isOK and status here
      .catch(err => console.error(err));
});

app.listen(PORT, process.env.IP, function() {
    console.info('Listening on port ' + PORT);
});