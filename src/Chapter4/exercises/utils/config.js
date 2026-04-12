require('dotenv').config()

const MongoDb_Url =
    process.env.NODE_ENV === 'test'
        ? process.env.TEST_MONGODB_URI
        : process.env.MONGODB_URI
const Port = process.env.PORT || 3001
const Secret = process.env.SECRET
const NodeEnv = process.env.NODE_ENV
module.exports = {
    MongoDb_Url,
    Port,
    Secret,
    NodeEnv
}
