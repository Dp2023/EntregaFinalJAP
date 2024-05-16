/*jshint esversion: 8 */


//--------------------------------------------------------------------------------------------------------------------------------------------
//  IMPORTS
//--------------------------------------------------------------------------------------------------------------------------------------------
require('dotenv').config();                                 // dotenv is a popular module used for loading environment variables from a .env file into process.env.
const express = require('express');                         // we want to use express
const cors = require('cors');                               // provides middleware that can be used with frameworks like Express.js to enable CORS for your server, allowing your server to accept requests from different origins (domains) while still adhering to browser security policies

const pinoLogger = require('./logger');                     // logger.js --> Pino is a fast and lightweight logging library for Node.js applications
const pinoHttp = require('pino-http');                      // JVV
const logger = require('./logger');                         // JVV

const connectToDatabase = require('./models/db');           // db.js --> connects to the MongoDB database
const {loadData} = require("./util/import-mongo/index");    // calling the loadData function will populate the database
      
const giftRoutes = require('./routes/giftRoutes');          // giftRoutes.js --> defines the middleware for handling requests to "/api/gifts"
const searchRoutes = require('./routes/searchRoutes');      // searchRoutes.js --> defines the middleware for handling requests to "/api/search"
const authRoutes = require('./routes/authRoutes');

//--------------------------------------------------------------------------------------------------------------------------------------------
//  INIT & CONFIG
//--------------------------------------------------------------------------------------------------------------------------------------------

const app = express();
// for all routes: enable CORS, allowing your server to accept requests from different origins (domains) while still adhering to browser security policies.
app.use("*",cors());

// define the server port
const port = 3060;

// set up the Express middleware to automatically parse JSON request bodies in incoming requests and populate "req.body" with the parsed JSON data
app.use(express.json());

// JVV: uitleg bij geven!!
app.use(pinoHttp({ logger }));


//--------------------------------------------------------------------------------------------------------------------------------------------
//  CONNECT TO THE DATABASE
//--------------------------------------------------------------------------------------------------------------------------------------------




// Connect to MongoDB; we only do this one time ( using the connection method defined in models/db.js )
// For DEV purposes: in connectToDatabase: we check if there are items in the database, if not, populate with the util\import-mongo content
connectToDatabase()
    .then( () => {
        pinoLogger.info('Connected to DB');
    })
    .catch( (e) => console.error('Failed to connect to DB', e) );


//--------------------------------------------------------------------------------------------------------------------------------------------
//  ROUTES
//--------------------------------------------------------------------------------------------------------------------------------------------


// API endpoints for getting ALL items from the database, or search by item ID
// The below Express use method sends all "/api/gifts" requests to the routes defined in that file
// see "routes/giftRoutes.js" 
app.use('/api/gifts', giftRoutes);

// API endpoint for searching gifts by name, category, condition or age in years
// The below Express use method sends all "/api/search" requests to the routes defined in that file
// see "routes/searchRoutes.js" 
app.use('/api/search', searchRoutes);


// JVV
app.use('/api/auth', authRoutes);



//--------------------------------------------------------------------------------------------------------------------------------------------
//  GLOBAL ERROR HANDLER
//--------------------------------------------------------------------------------------------------------------------------------------------

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/",(req,res)=>{
    res.send("Inside the server");
});

//--------------------------------------------------------------------------------------------------------------------------------------------
//  START UP THE SERVER 
//--------------------------------------------------------------------------------------------------------------------------------------------

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
