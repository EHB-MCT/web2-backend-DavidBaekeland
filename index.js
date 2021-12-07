const fs = require('fs/promises');
const express = require('express');
const bodyParser = require('body-parser')
const { MongoClient } = require("mongodb");
const cors = require("cors");
require('dotenv').config();

// create the mongo Client to use
//const client = new MongoClient(process.env.FINAL_URL)

const app = express();
const port = process.env.PORT;


app.use(express.static("public"));
// alle code wordt eerst uitgevoerd door middelware (bodyParser) dan in functies
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.redirect("/info.html");
})

app.listen(port, () => {
  console.log(`My first REST API Example app listening at http://localhost:${port}`)
})