/*jshint esversion: 8 */
//----------------------------------------------------------------------------------------------------------------------------------------------------
//  This file bundles the API endpoint on route '/api/search', for getting one or more gifts based on:
//      * name
//      * category
//      * condition
//      * age in years
//----------------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------
//  IMPORTS
//--------------------------------------------------------------------------------------------------------------------------------------------
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

//--------------------------------------------------------------------------------------------------------------------------------------------
//  API ENDPOINT(S)
//--------------------------------------------------------------------------------------------------------------------------------------------

// Search for gifts
router.get('/', async (req, res, next) => {
    try {
        //Connect to MongoDB using connectToDatabase database (also works if the connection has already been established, see models/db.js !)
        const db = await connectToDatabase();

        // use the collection() method to retrieve the gift collection
        const collection = db.collection("gifts");

        // Initialize the query object
        let query = {};

        // We initialize a gifts array, in which we will store our search results
        let gifts = [];

        // first we set the database search query filter by checking what the client is requesting!

        // If the name filter exists AND when removing white spaces it is not an empty string, save the name filter to the query 
        if (req.query.name && req.query.name.trim() !== '' ) {
            
            query.name = { $regex: req.query.name, $options: "i" }; // Using regex for partial match, case-insensitive
        }

        // if the client makes a query about category, set query.category to the category provided in the request 
        if (req.query.category) {
            query.category = req.query.category;
        }

        // if the client makes a query about condition, set query.condition to the condition provided in the request 
        if (req.query.condition) {
            query.condition = req.query.condition;
        }

        // if the client makes a query about max age in years, set query.age_years to the age in years provided in the request
        if (req.query.age_years) {
            
            query.age_years = { $lte: parseInt(req.query.age_years) }; // $lte operator = less than or equal 
        }

        // now that the query filter is set, we do the actual fetch using the find(query) method. We store the result in the `gifts` variable
        gifts = await collection.find(query).toArray();

        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

//--------------------------------------------------------------------------------------------------------------------------------------------
//  EXPORTS
//--------------------------------------------------------------------------------------------------------------------------------------------

module.exports = router;
