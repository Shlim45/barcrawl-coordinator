require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const helpers = require('./modules');
const bodyParser = require('body-parser');

const PORT = 8081 || process.env.PORT;

const authRoutes = require('./routes/auth');

const passportConfig = require('./passport');

passportConfig();

const corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token'],
};
app.use(cors(corsOption));

//rest API requirements
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// ROUTES

app.get('/', function(req, res) {
    res.json({message: "Make a GET request to /api/search to search"});
});

// SEARCH ROUTE

app.get('/api/search', function(req, res) {
    const { term, location } = req.query;
    
    helpers.yelpSearch(term, location)
      .then(data => res.json(data)) // do checking of res.isOK and status here
      .catch(err => console.error(err));
});

// AUTH ROUTES

app.use('/api/v1', authRoutes);

app.listen(PORT, process.env.IP, function() {
    console.info('Listening on port ' + PORT);
});