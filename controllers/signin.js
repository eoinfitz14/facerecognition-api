const handleSignin = (req, res, db, bcrypt) => {

  const { email, password } = req.body; // destructuring the request and assigning the values of it to constant variables
  if( !email || !password ){ // if any of these are empty
    return res.status(400).json('invalid form submission');
  }

  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash); // campareSync returns a boolean value
      if(isValid){
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else{
        res.status(400).json('wrong credentials')
      }
    })
    .catch( err => res.status(400).json('wrong credentials'))
}

module.exports = {
  handleSignin: handleSignin
};

/*
  * example of knex syntax:
  * db.select('*').from('users') // returns a promise
  * use .then(data => { etc etc }) to access the data
*/