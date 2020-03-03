const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs'); 
const cors = require('cors');
const knex = require('knex')

const db = knex ({ // taken from knex user documentation for node.js
  client: 'pg', // dependency we downloaded
  connection: {
    host : '127.0.0.1', // reminder: 127.0.0.1 is localhoss's IP
    user : 'Eoin', 
    password : '',
    database : 'facerecognition' //db name
  }
});

/*
  * example of knex syntax:
  * db.select('*').from('users') // returns a promise
  * use .then(data => { etc etc }) to access the data
*/

const app = express(); // create the app

//Middleware
app.use(bodyParser.json());
app.use(cors()); // security middleware. Google would not let us access the api through the front end without it

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req,res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash); // campareSync returns a boolean value
      if(isValid){
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else{
        res.status(400).json('wrong credentials')
      }
    })
    .catch( err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req,res) => {
  const { email, name, password } = req.body; // destructuring the request and assigning the values of it to constant variables
  const hash = bcrypt.hashSync(password); // taken from bcyrpt documentation
  //NB!!! Transaction is needed so that we can update the user and login table at the same time
    db.transaction(trx => { //can find in knex docs ... trx instead of db 
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
        .returning('*') // allows us to return what we have inserted
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => { // provided the insert was a success return what was inserted.. i.e a promise was used (.then() is a callback to promises)
          res.json(user[0]);
        })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch (err => res.status(400).json('unable to register')) //NB don't return the err as it will give the client too much info on the DB

})

// V useful function for iterating through an array of objects
app.get('/profile/:id', (req, res) => {
  const { id } = req.params; // by usering :id syntax for the url endpoint we can access id in the params
  db.select('*').from('users').where({
    id: id
  })
  .then(user => {
    if(user.length) { // if there's 1 or more users
      res.json(user[0]);
    } else{
      res.status(400).json('Not found');
    }
  })
  .catch(err => res.status(400).json('Error getting user'))
})

//every time an image is sent, update the number of entries 
app.put('/image', (req,res) => {
  const { id } = req.body; 
  db('users').where('id', '=', id)
  .increment('entries', 1) // form of "update"
  .returning('entries')
  .then(entries => {
    res.json(entries[0])
  })
  .catch(err => res.status(400).json('Unable to get entries'))
})

// Load hash from your password DB.
// bcrypt.hash(password, null, null, function(err, hash) {
//   console.log(hash);
// });
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//   // res = false
// });

app.listen(3000, () => { // listen on port 3000 and after listen happens run the function i.e the second parameter
  console.log('app is running on port 3000 ')
}); 
