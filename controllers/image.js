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
  handleImage: handleImage
};