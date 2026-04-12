const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const ErrorCode = require('../models/errorCodes')
const logger = require('../utils/logger')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
    logger.log('Received at Post /', request)
    var error = isValid(request.body)
    if (error) {
        return next(error)
    }
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
})

function isValid(requestBody) {
    if (!requestBody) {
        let error = new Error('request body is empty')
        error.name = ErrorCode.ValidationError
        logger.error(error)
        return error
    } else if (!requestBody.author || requestBody.author.trim === '') {
        let error = new Error('author name is missing')
        error.name = ErrorCode.ValidationError
        logger.error(error)
        return error
    } else if (!requestBody.title || requestBody.title.trim === '') {
        let error = new Error('blog title is missing')
        error.name = ErrorCode.ValidationError
        logger.error(error)
        return error
    } else if (!requestBody.url || requestBody.url.trim === '') {
        let error = new Error('blog url is missing')
        error.name = ErrorCode.ValidationError
        logger.error(error)
        return error
    }
    logger.info('Seems like a valid request, hurrrah')
}
module.exports = blogRouter
