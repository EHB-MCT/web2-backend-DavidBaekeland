// const fs = require('fs/promises');
import fs from 'fs/promises';
import fetch from 'node-fetch';
import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import * as dotenv from "dotenv"
dotenv.config()
// const express = require('express');
// const bodyParser = require('body-parser')
// const { MongoClient } = require("mongodb");
//const cors = require("cors");
//require('dotenv').config();



// create the mongo Client to use
const client = new MongoClient(process.env.FINAL_URL)

const app = express();
const port = process.env.PORT;


app.use(express.static("public"));
// alle code wordt eerst uitgevoerd door middelware (bodyParser) dan in functies
app.use(bodyParser.json());
// app.use(cors());


app.get('/', (req, res) => {
    res.redirect("/info.html");
})

app.get('/users', async(req, res) => {
  try {
      await client.connect();

      console.log("Connected correctly to server");
      const db = client.db(process.env.DB);

      const col = db.collection("users");

      const data =  await col.find({}).toArray();
      res.status(200).send(data);
  }catch(error)  {
      console.log(error);
      res.status(500).send({
          error: 'error',
          value: error
      });
  }finally  {
      await client.close();
  }
});

app.post('/users', async(req, res) => {
  try {
      await client.connect();

      console.log("Connected correctly to server");
      const db = client.db(process.env.DB);

      let user =  {
        name: req.body.name,
        password: req.body.password,
        department: req.body.department,
      };

      const col = db.collection("users");
      let insertResult = await col.insertOne(user);
      console.log(`A document was inserted with the _id: ${insertResult.insertedId}`);

      const data =  await col.find({}).toArray();
      res.status(201).send(`boardgame succesfully saved with id ${req.body.name}`);
  }catch(error)  {
      console.log(error);
      res.status(500).send({
          error: 'error',
          value: error
      });
  }finally  {
      await client.close();
  }
});

app.get('/icons', async(req, res)  =>  {
    try {
        res.redirect("/icons.html");
    }catch(error)  {
        console.log(error);
        res.status(500).send({
            error: 'error',
            value: error
        });
    }
})

app.get('/icons/:name', async(req, res)  =>  {
  const name = req.params.name;
  console.log(name);
    try {
        const options = {
            method: 'GET',
            mode: 'cors',
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer X0vjEUN6KRlxbp2DoUkyHeM0VOmxY91rA6BbU5j3Xu6wDodwS0McmilLPBWDUcJ1'
            }
          };
          
          if(name=="account")  {
            getData('https://api.iconfinder.com/v4/icons/search?query=Stefan%20Taubert&count=4', options).then(response => {
              console.log(response.icons[3].vector_sizes[0].formats[0].download_url);
          
                  getSvg(`${response.icons[1].vector_sizes[0].formats[0].download_url}`, options).then(response2 =>  {
                    // console.log(response2) 
                    res.status(200).send(response2);       
                  });
              
            })
          }else if(name=="logout")  {
            getData("https://api.iconfinder.com/v4/icons/search?query=Heroicons&count=45", options).then(response => {
              //https://www.iconfinder.com/search?q=Heroicons
              console.log(response.icons[27].icon_id);
              response.icons.forEach(logout => {
                 if(logout.icon_id == 7124045) {
                    getSvg(`${logout.vector_sizes[0].formats[0].download_url}`, options).then(response2 =>  {
                        res.status(200).send(response2);       
                    });
                 }
              })
            })
          }else if(name=="download")  {
            getData("https://api.iconfinder.com/v4/icons/search?query=Heroicons&count=45", options).then(response => {
              //https://www.iconfinder.com/search?q=Heroicons
              // https://www.iconfinder.com/icons/7124090/download_icon
              console.log(response.icons[9].icon_id);
              response.icons.forEach(logout => {
                 if(logout.icon_id == 2867888) {
                    getSvg(`${logout.vector_sizes[0].formats[0].download_url}`, options).then(response2 =>  {
                        res.status(200).send(response2);       
                    });
                 }
              })
            })
          }else if(name=="plus")  {
            getData("https://api.iconfinder.com/v4/icons/search?query=Heroicons&count=152", options).then(response => {
              //https://www.iconfinder.com/search?q=Heroicons
              // https://www.iconfinder.com/icons/2867890/edit_icon
              // Er zijn 152 icons => array => 151
              console.log(response.icons[151].icon_id);
              response.icons.forEach(logout => {
                 if(logout.icon_id == 2867933) {
                    getSvg(`${logout.vector_sizes[0].formats[0].download_url}`, options).then(response2 =>  {
                        res.status(200).send(response2);       
                    });
                 }
              })
            })
          }else if(name=="building")  {
            getData("https://api.iconfinder.com/v4/icons/search?query=Heroicons&count=67", options).then(response => {
              //https://www.iconfinder.com/search?q=Heroicons
              // https://www.iconfinder.com/icons/2867890/edit_icon
              console.log(response.icons[66].icon_id);
              response.icons.forEach(logout => {
                 if(logout.icon_id == 2867869) {
                    getSvg(`${logout.vector_sizes[0].formats[0].download_url}`, options).then(response2 =>  {
                        res.status(200).send(response2);       
                    });
                 }
              })
            })
          }else if(name=="travel")  {
            getData("https://api.iconfinder.com/v4/icons/search?query=Heroicons&count=66", options).then(response => {
              //https://www.iconfinder.com/search?q=Heroicons
              // https://www.iconfinder.com/icons/2867890/edit_icon
              console.log(response.icons[65].icon_id);
              response.icons.forEach(logout => {
                 if(logout.icon_id == 2867867) {
                    getSvg(`${logout.vector_sizes[0].formats[0].download_url}`, options).then(response2 =>  {
                        res.status(200).send(response2);       
                    });
                 }
              })
            })
          }else if(name=="money")  {
            getData("https://api.iconfinder.com/v4/icons/search?query=Heroicons&count=100", options).then(response => {
              //https://www.iconfinder.com/search?q=Heroicons
              // https://www.iconfinder.com/icons/2867890/edit_icon
              console.log(response.icons[99].icon_id);
              response.icons.forEach(logout => {
                 if(logout.icon_id == 2867884) {
                    getSvg(`${logout.vector_sizes[0].formats[0].download_url}`, options).then(response2 =>  {
                        res.status(200).send(response2);       
                    });
                 }
              })
            })
          }else  {
            res.status(400).send("Bad parameter");
          }
          

          async function getData(url, options) {
            let response = await fetch(url, options)
            return await response.json();
          }  
      
          async function getSvg(url, options) {
            let response = await fetch(url, options)
            return await response.text();
          } 
                  
        
    }catch(error)  {
        console.log(error);
        res.status(500).send({
            error: 'error',
            value: error
        });
    }
})

app.listen(port, () => {
  console.log(`My first REST API Example app listening at http://localhost:${port}`)
})