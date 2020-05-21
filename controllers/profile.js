// V useful function for iterating through an array of objects

const handleProfileGet = (req, res, db) => {
  const { id } = req.params; // by using :id syntax for the url endpoint we can access id in the url params
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
}

module.exports = {
  handleProfileGet: handleProfileGet
};