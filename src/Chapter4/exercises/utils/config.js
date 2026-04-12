require('dotenv').config()
const MongoDb_Url =
    process.env.NODE_ENV === 'test'
        ? process.env.TEST_MONGODB_URI
        : process.env.MONGODB_URI
const Port = process.env.PORT || 3001

module.exports = {
    MongoDb_Url,
    Port,
}
