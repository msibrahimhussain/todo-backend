const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");

const normalizePort = require("./normalizeport");

const PORT = normalizePort(process.env.PORT || 5000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static('public'));

app.use(cors());

let dbObj = require('./db');
let theDB = dbObj.theDB;

app.get('/', (req, res) => {
  console.log("Received a GET request");
  res.json({message: "Hello there"});
});

app.get('/notes', (req, res) => {
  console.log("Received a GET /notes request");
  theDB.all("SELECT * FROM notes", (err, results) => {
    if (err) {
      res.send(err.message);
    }
    console.log(results);
    res.json(results);
  })
  
});

app.post('/notes', (req, res) => {
  console.log("Received a POST /notes request.");
  
  let note_id = req.body.note_id; 
  let note_title = req.body.note_title;
  let note_body = req.body.note_body;
  
  console.log(`Data: { note_id: ${note_id}, note_title: ${note_title}, note_body: ${note_body} }`);
  
  
  theDB.run('INSERT INTO notes (note_id, note_title, note_body) VALUES(?, ?, ?)', [note_id, note_title, note_body], (err => {
    if (err) {
      console.log(err.message);
      res.send(err.message);
    }
    else {
      theDB.all('SELECT * FROM notes', [], (err, results) => {
        if (err) {
          console.log(err.message);
          res.send(err.message);            
        }
        else {
          res.json(results);
        }
      })
    }
  }))  
   
  // TODO:
  app.get('/notes/:note_id', (req, res) => {
    const note_id = req.params.note_id;
    let sql = 'SELECT note_title, note_body FROM notes WHERE note_id = ?';
    theDB.run(sql, [note_id], (err => {
      if (err) {
        console.log(err.message);
        res.send(err.message);
      }
      else {
        theDB.all(sql, [note_id], (err, results) => {
          if(err) {
            console.log(err.message);
            res.send(err.message);          
          }
          else {
            res.json(results);
          }
        })
      }
    }))
  });
  
});

app.put('/notes/:note_id', (req, res) => {
  // Extract note from req and update DB with it using its ID and body
  // Send back an OK/Fail message
  console.log("Receiving a PUT /notes/:note_id request");

  const note_id = req.params.note_id;
  const note_title = req.body.note_title;
  const note_body  = req.body.note_body; 

  console.log(`Data: { note_id: ${note_id}, note_title: ${note_title}, note_body: ${note_body} }`);
  
  let sql = 'UPDATE notes SET note_title = ?, note_body = ? WHERE note_id = ?';
  theDB.run(sql, [note_title, note_body, note_id], (err => {
    if (err) {
      console.log(err.message);
      res.send(err.message);
    }
    else {
      theDB.all('SELECT * FROM notes', [], (err, results) => {
        if(err) {
          console.log(err.message);
          res.send(err.message);          
        }
        else {
          res.json(results);
        }
      })
    }
  }))

});

app.delete('/notes/:note_id', (req, res) => {
  // Find note in DB by id and delete it
  // Send back an OK/Fail message
  console.log("Received a DELETE /notes/:note_id request");
  const id = req.params.note_id;
  let sql = 'DELETE FROM notes WHERE note_id = ?';
  theDB.run(sql, [id], (err) => {
    if (err) {
      console.log(err.message);
      res.send(err.message);
    }
    else {
      theDB.all('SELECT * FROM notes', [], (err, results) => {
        if (err) {
          console.log(err.message);
          res.send(err.message);
        }
        else {
          res.json(results);
        }
      })
    }
  })
  
});


app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is listening on port ${PORT}...`);
});

