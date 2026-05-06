const unAuthblogRouter = require('express').Router()
const Blog = require('../models/blogs')
const ErrorCode = require('../models/errorCodes')
const logger = require('../utils/logger')
const opts = { runValidators: true }
const validator = require('../utils/tokenvalidator')


unAuthblogRouter.get('/', async (request, response, next) => {
    logger.log('Received at Post /', request.body)
    try {
        response.json(await Blog.find({}).populate('user',
            {
                username: 1,
                name: 1,
                _id: 1
            }))
    }
    catch (error) {
        return next(error)
    }
})

module.exports = unAuthblogRouter
