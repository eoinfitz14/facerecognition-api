const Clarifai = require('clarifai');
require('dotenv').config();

// access the .env file using process.env
//REACT_APP_ must be the prefix of all variables in the .env file for React to be able to access them 
//const API_KEY = process.env.CLARIFAI_API_KEY;
 
// imported Clarifai from CLarifai.com (machine learning API)
const app = new Clarifai.App({
  apiKey: "80f7447478554e79ab91887344655dc0"
});

const handleApiCall = (req, res) => {
  app.models
  .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => {
    res.json(data);
  })
  .catch(err => res.status(400).json('unable to work with API'))
}

//every time an image is sent, update the number of entries 
const handleImage = (req, res, db) => {
  const { id } = req.body; 
  db('users').where('id', '=', id)
  .increment('entries', 1) // form of "update"
  .returning('entries')
  .then(entries => {
    res.json(entries[0])
  })
  .catch(err => res.status(400).json('Unable to get entries'))
}

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
};