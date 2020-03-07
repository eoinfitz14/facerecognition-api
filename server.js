const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs'); 
const cors = require('cors');
const knex = require('knex')

const register = require('./controllers/register'); 
const signin = require('./controllers/signin');
const profile = require('./controllers/profile'); 
const image = require('./controllers/image');

const db = knex ({ // taken from knex user documentation for node.js
  client: 'pg', // dependency we downloaded
  connection: {
    host : '127.0.0.1', // reminder: 127.0.0.1 is localhost's IP
    user : 'Eoin', 
    password : '',
    database : 'facerecognition' //db name
  }
});

const app = express(); // create the app

//Middleware
app.use(bodyParser.json());
app.use(cors()); // security middleware. Google would not let us access the api through the front end without it

app.get('/', (req, res) => {
  res.send(database.users);
})

// Note: the request and response from the post operation are passed to the controller as well as the db and bcrypt dependencies (injection)
// as these dependencies are passed through here, we don't need to 'require' them at the top of signin.js
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) 
app.get('/profile/:id', (req, res) => { profile.handleProdileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db)})


app.listen(3000, () => { // listen on port 3000 and after listen happens run the function i.e the second parameter
  console.log('app is running on port 3000 ')
}); 
