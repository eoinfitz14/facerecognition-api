
const handleRegister = (req, res, db, bcrypt) => {
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

}

module.exports = {
  handleRegister: handleRegister
};