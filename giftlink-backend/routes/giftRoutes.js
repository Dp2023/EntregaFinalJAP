/*jshint esversion: 8 */
//----------------------------------------------------------------------------------------------------------------------------------------------------
//  This file bundles the API endpoints on route '/api/gifts' 
//  - getting ALL gift items
//  - getting a gift item based on the item ID
//  - posting a new gift to the database
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


// GET endpoint to retrieve all items stored in the database
router.get('/', async (req, res) => {
    try {
        // Connect to MongoDB and store connection to db constant (also works if the connection has already been established, see models/db.js !)
        const db = await connectToDatabase();

        // use the collection() method to retrieve the gift collection
        const collection = db.collection("gifts");

        // Fetch all gifts using the collection.find method. Chain with toArray method to convert to JSON array
        const gifts = await collection.find({}).toArray();

        // return the gifts using the res.json method
        res.json(gifts);

    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts');
    }
});


// GET endpoint to fetch a specific item by its ID
router.get('/:id', async (req, res) => {
    try {
        // Connect to MongoDB and store connection to db constant (also works if the connection has already been established, see models/db.js !)
        const db = await connectToDatabase();

        // use the collection() method to retrieve the gift collection
        const collection = db.collection("gifts");

        // we define an id variable, and get it from the request parameters --> JVV: would be better to have a check on here!
        const id = req.params.id;

        // find a specific item by ID using the collection.fineOne method and store in constant called gift
        const gift = await collection.findOne({ id: id });

        // check if the previous search action yielded a result, if not send a 404 status to the client 
        if (!gift) {
            return res.status(404).send('Gift not found');
        }
        // if the item was found, put the item data in json format, and put it in the response to the client
        else{
            res.json(gift);
        }

        
    } catch (err) {
        console.error('Error fetching gift:', err);
        res.status(500).send('Error fetching gift');
    }
});

// POST end point for adding a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const gift = await collection.insertOne(req.body);

        res.status(201).json(gift);
    } catch (e) {
        next(e);
    }
});

//--------------------------------------------------------------------------------------------------------------------------------------------
//  EXPORTS
//--------------------------------------------------------------------------------------------------------------------------------------------

module.exports = router;
