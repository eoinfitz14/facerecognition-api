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
  res.send('this is working');
})

app.post('/signin', (req,res) => {
  if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
    res.json("success");
  }
  else{
    res.status(400).json("error logging in")
  }
})

app.listen(3000, () => { // listen on port 3000 and after listen happens run the function i.e the second parameter
  console.log('app is running on port 3000 ')
}); 
