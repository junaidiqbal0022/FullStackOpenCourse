const mongoose = require('mongoose')
require('dotenv').config()
const peopleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'name is required with min 5 length'],
    minLength: 5,
  },
  number: {
    type: String,
    minLength: 8,
    required: [
      true,
      'User phone number required, accepted format xx-xxxxx or xxx-xxxxxx, Min 8 chars',
    ],
    validate: {
      validator: function (v) {
        return /^\d{3}-\d+$/.test(v) || /^\d{2}-\d+$/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
})

const generateId = () => {
  return crypto.randomUUID().toString()
}

// const password = args[2]
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
if (!url || url.trim() === '') {
  console.error(
    'MONGODB_URI environment variable is not set. Please set it to connect to the database.',
  )
  process.exit(1)
}
//console.log('Connecting to MongoDB with URL:', url)
mongoose
  .connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    this
  })
const Person = mongoose.model('Person', peopleSchema)

module.exports = {
  generateId,
  Person,
}
