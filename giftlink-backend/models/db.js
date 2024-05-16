// IMPORTS
require('dotenv').config();                             //dotenv is a popular module used for loading environment variables from a .env file into process.env.



const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    // if a connection to our database already exists, return it
    if (dbInstance){
        return dbInstance;
    } 
    // if a connection to our database does not exist yet, establish one and return it
    else{
        const client = new MongoClient(url);      

        // Connect to MongoDB
        await client.connect();

        // Connect to database giftDB and store in variable dbInstance
        dbInstance = client.db(dbName);
      
        // Return database instance
        return dbInstance;
    }  
}

module.exports = connectToDatabase;
