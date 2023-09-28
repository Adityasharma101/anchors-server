const express = require("express");
const axios = require("axios");
const app = express();
const nodemailer = require('nodemailer');
const cors = require("cors");
const port = 3500; 

const reqCallback = require("./Controllers/reqCallback") 
const api = require('./Controllers/api')

// Middlewares
app.use(express.json());
app.use(cors());
require('dotenv').config();


app.get("/" , (req,res)=>{
  res.send("Im server")
})

// Define a route to retrieve engagement metrics for a YouTube video
app.post('/api' ,api)

// Define a route for request callback

app.post('/request-callback' , reqCallback)


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
