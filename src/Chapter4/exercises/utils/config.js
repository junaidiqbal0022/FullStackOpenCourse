require('dotenv').config()
const MongoDb_Url = process.env.MONGODB_URI
const Port = process.env.PORT || 3001

module.exports = {
  MongoDb_Url,
  Port,
}
