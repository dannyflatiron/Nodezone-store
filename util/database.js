const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = callback => {
  // createe the database & store
  MongoClient.connect(`mongodb+srv://dannyreina:${process.env.PASSWORD}@cluster0.vnxsz.mongodb.net/shop?retryWrites=true&w=majority`)
  .then(client => {
    console.log('Connected')
    _db = client.db()
    callback(client)
  })
  .catch(error => {
    console.log(error)
    throw error
  })
}
// return database if it exists
const getDb = () => {
  if (_db) {
    return _db
  }
  throw 'No database found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb


