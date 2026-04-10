const mongoose = require('mongoose')
require('dotenv').config()
const peopleSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
});

const generateId = () => {
    return crypto.randomUUID().toString();
}

// const password = args[2]
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI;
//console.log('Connecting to MongoDB with URL:', url)
mongoose.connect(url)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        this
    })
const Person = mongoose.model('Person', peopleSchema);

module.exports = {
    generateId,
    Person

}