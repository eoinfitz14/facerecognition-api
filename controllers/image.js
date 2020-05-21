const Clarifai = require('clarifai');
require('dotenv').config();

// access the .env file using process.env
//REACT_APP_ must be the prefix of all variables in the .env file for React to be able to access them 
//const API_KEY = process.env.CLARIFAI_API_KEY;
 
// imported Clarifai from CLarifai.com (machine learning API)
const app = new Clarifai.App({
  apiKey: process.env.API_CLARIFAI
});


const handleApiCall = (req, res) => {
  app.models
  .predict(Clarifai.FACE_DETECT_MODEL, req.body.input) // body input is the URL
  .then(data => { // "data" could be called anything. it's just what is returned 
    res.json(data); // return the entire response as json
  })
  .catch(err => res.status(400).json('unable to work with API'))
}

//every time an image is sent, update the number of entries 
const handleImage = (req, res, db) => {
  const { id } = req.body;  // req.body specifies what will be in the request... i.e all we need is a json object {"id": "124"}
  db('users').where('id', '=', id) // find the id
  .increment('entries', 1) // form of "update" i.e increment it by 1
  .returning('entries')
  .then(entries => {
    res.json(entries[0]) // res.json specifies what will be in the response when we send a request to the endpoint
  })
  .catch(err => res.status(400).json('Unable to get entries')) // if the ID isn't found, print this out
}

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
};