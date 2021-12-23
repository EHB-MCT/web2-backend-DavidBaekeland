import fs from 'fs/promises';
import fetch from 'node-fetch';
import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import * as dotenv from "dotenv"
dotenv.config()

// create the mongo Client to use
const client = new MongoClient(process.env.FINAL_URL)

const app = express();
const port = process.env.PORT;


app.use(express.static("public"));
// alle code wordt eerst uitgevoerd door middelware (bodyParser) dan in functies
app.use(bodyParser.json());
app.use(cors());


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

// Get a specific user
app.post('/user', async(req, res) => {
  try {
      await client.connect();
      
      let user;
      
      // check if id exist
      if(req.body.id && !req.body.email && !req.body.password)  {
        user = {
          _id: ObjectId(req.body.id)
        };
      } else {
        user = {
          email: req.body.email,
          password: req.body.password,
        }
      }


      console.log(req.body);

      console.log("Connected correctly to server");
      const db = client.db(process.env.DB);

      const col = db.collection("users");

      const data =  await col.findOne(user);
      console.log(data)
      if(data != null) {
        res.status(200).send(data);
      } else  {
        res.status(400).send({err: "Input is wrong"})
      }
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

// Create a new User
app.post('/newUser', async(req, res) => {
  try {
      await client.connect();

      console.log("Connected correctly to server");
      const db = client.db(process.env.DB);

      let user =  {
        email: req.body.email,
        password: req.body.password,
        department: req.body.department,
        question: []
      };

      const col = db.collection("users");

      const data =  await col.insertOne(user)
      res.status(201).send(data);
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

// Change a password from a specific user
app.put('/users', async(req, res) => {
  //https://docs.mongodb.com/drivers/node/current/usage-examples/updateOne/
  try {
    let email = req.body.email;
    let setPassword = req.body.setPassword;
    console.log(email, setPassword);

    await client.connect();

    const db = client.db(process.env.DB);
    const col = db.collection("users");

    // naam user veranderen met parameter
    const filter = { email: email };

    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
        password: setPassword
      },
    };
    const result = await col.updateOne(filter, updateDoc);
    res.status(200).send(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
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

// Add a question to a specific user
app.put('/question', async(req, res) => {
  //https://docs.mongodb.com/drivers/node/current/usage-examples/updateOne/
  try {
    let id = req.body.id;
    let setQuestions = req.body.setQuestions;
    console.log(id, setQuestions);

    await client.connect();

    const db = client.db(process.env.DB);
    const col = db.collection("users");

    // naam user veranderen met parameter
    const filter = {_id: ObjectId(id)};

    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
        question: setQuestions
      },
    };
    const result = await col.updateOne(filter, updateDoc);
    res.status(200).send(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
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

// Delete a specific user
app.delete('/users/:id', async(req, res) => {
  //https://docs.mongodb.com/drivers/node/current/usage-examples/deleteOne/
  try {
    let id = ObjectId(req.params.id);

    console.log(id);

    await client.connect();

    const db = client.db(process.env.DB);
    const col = db.collection("users");

    const query = {_id: id};
    const result = await col.deleteOne(query);

    
    if (result.deletedCount === 1) {
      console.log("sdqfqsdfqsdf");
      res.status(201).send("Successfully deleted one document.");
    } else {
      res.status(400).send(`There is null documents with name: ${id}`);
    }
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

// Get Root icons
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

// Get a specific icon
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
            try  {
              getData('https://api.iconfinder.com/v4/icons/search?query=Stefan%20Taubert&count=4', options).then(response => {
                console.log(response.icons[3].vector_sizes[0].formats[0].download_url);
            
                    getSvg(`${response.icons[1].vector_sizes[0].formats[0].download_url}`, options).then(response2 =>  {
                      // console.log(response2) 
                      res.status(200).send(response2);       
                    });
                
              })
            }catch(error) {
              console.log(error)
            };
          }else if(name=="logout")  {
            try {
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
            }catch(error) {
              console.log(error)
            };
          }else if(name=="download")  {
            try  {
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
            }catch(error) {
              console.log(error)
            };
          }else if(name=="plus")  {
            try {
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
            }catch(error) {
              console.log(error)
            };
          }else if(name=="building")  {
            try {
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
            }catch(error) {
              console.log(error)
            };
          }else if(name=="travel")  {
            try {
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
            }catch(error) {
              console.log(error)
            };
          }else if(name=="money")  {
            try {
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
            }catch(error) {
              console.log(error)
            };
          }else if(name=="pijl")  {
            try {
              getData("https://api.iconfinder.com/v4/icons/search?query=Heroicons&count=207", options).then(response => {
                //https://www.iconfinder.com/search?q=Heroicons
                // https://www.iconfinder.com/icons/2867890/edit_icon
                console.log(response.icons[206].icon_id);
                response.icons.forEach(logout => {
                   if(logout.icon_id == 7124043) {
                      getSvg(`${logout.vector_sizes[0].formats[0].download_url}`, options).then(response2 =>  {
                          res.status(200).send(response2);       
                      });
                   }
                })
              })
            }catch(error) {
              console.log(error)
            };
          }else if(name=="refresh")  {
            try {
              getData("https://api.iconfinder.com/v4/icons/search?query=Heroicons&count=76", options).then(response => {
                //https://www.iconfinder.com/search?q=Heroicons
                // https://www.iconfinder.com/icons/2867890/edit_icon
                console.log(response.icons[75].icon_id);
                response.icons.forEach(logout => {
                   if(logout.icon_id == 2867936) {
                      getSvg(`${logout.vector_sizes[0].formats[0].download_url}`, options).then(response2 =>  {
                          res.status(200).send(response2);       
                      });
                   }
                })
              })
            }catch(error) {
              console.log(error)
            };
          }else {
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