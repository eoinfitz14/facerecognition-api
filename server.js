const express = require('express');

const app = express(); // create the app

app.get('/', (req, res) => {
  res.send('this is working');
})

app.listen(3000, () => { // listen on port 3000 and after listen happens run the function i.e the second parameter
  console.log('app is running on port 3000 ')
}); 
