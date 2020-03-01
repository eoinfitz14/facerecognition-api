const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs'); 
const cors = require('cors');
const knex = require('knex')

const postgres = knex ({ // taken from knex user documentation for node.js
  client: 'pg', // dependency we downloaded
  connection: {
    host : '127.0.0.1', // reminder: 127.0.0.1 is localhoss's IP
    user : 'Eoin', 
    password : '',
    database : 'facerecognition' //db name
  }
});

/*
  * KNEX SYNTAX EXAMPLE
  * postgres.select('*').from('users')
*/

const app = express(); // create the app

//Middleware
app.use(bodyParser.json());
app.use(cors()); // security middleware. Google would not let us access the api through the front end without it

const database = { // temporary "database"..... just an array of objects
  users: [
    {
      id: '123',
      name: 'John',
      password: 'cookies',
      email: 'john@gmail.com',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      password: 'bananas',
      email: 'sally @gmail.com',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com'
    }
  ]
}

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req,res) => {
  if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
    res.json(database.users[0]);
  }
  else{
    res.status(400).json("error logging in")
  }
})

app.post('/register', (req,res) => {
  const { email, name } = req.body; // destructuring the request and assigning the values of it to constant variables
  let lastUserIndex = database.users.length-1;
  database.users.push({ // pushing a new user object into the user array! NB v useful
    id: '125', // need to make dynamic
      name: name,
      email: email,
      entries: 0,
      joined: new Date()
  })
  /*
  Note: I think the push isn't updating the 'DB' quickly enough so it prints out the 2nd last object rather than the last
  */
  res.json(database.users[lastUserIndex]);
})

// V useful function for iterating through an array of objects
app.get('/profile/:id', (req, res) => {
  const { id } = req.params; // by usering :id syntax for the url endpoint we can access id in the params
  let found = false;
  database.users.forEach(user => {
    if(user.id === id){
      found = true;
      return res.json(user);
    }
  })
  if(!found){
    res.status(400).json('not found');
  }
})

//every time an image is sent, update the number of entries 
app.put('/image', (req,res) => {
  const { id } = req.body; 
  let found = false;
  database.users.forEach(user => {
    if(user.id === id){
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  })
  if(!found){
    res.status(400).json('not found');
  }
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