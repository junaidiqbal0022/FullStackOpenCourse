const resetRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')

resetRouter.post('/', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    console.log('deleted All Successfully')
    response.status(204).end()
})

module.exports = resetRouter