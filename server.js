const express = require('express');
const bodyParser = require('body-parser');

const app = express(); // create the app
app.use(bodyParser.json());

const database = { // temporary "database"..... just an array of objects
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally @gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req,res) => {
  if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
    res.json("success");
  }
  else{
    res.status(400).json("error logging in")
  }
})

app.post('/register', (req,res) => {
  const { email, name, password } = req.body; // destructuring the request and assigning the values of it to constant variables
  var lastUserIndex = database.users.length-1;
  database.users.push({ // pushing a new user object into the user array! NB v useful
    id: '125', // need to make dynamic
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date()
  })
  /*
  Note: I think the push isn't updating the 'DB' quickly enough so it prints out the 2nd last object rather than the last
  */
  res.json(database.users[lastUserIndex]);
})

app.listen(3000, () => { // listen on port 3000 and after listen happens run the function i.e the second parameter
  console.log('app is running on port 3000 ')
}); 
