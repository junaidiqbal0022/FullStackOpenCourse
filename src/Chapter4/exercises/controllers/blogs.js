const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const ErrorCode = require('../models/errorCodes')
const logger = require('../utils/logger')
const opts = { runValidators: true }
blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
    logger.log('Received at Post /', request.body)
    var error = isValid(request.body)
    if (error) {
        return next(error)
    }
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response, next) => {
    logger.log('Received at delete for id', request.params.id)
    if (!request.params.id) {
        const err = new Error('Id is missing')
        err.nmae = ErrorCode.ValidationError
        return next(err)
    }
    await Blog.deleteOne({ _id: request.params.id })
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
    logger.log(`Received at put ${request.params.id} ${request.body}`)
    if (!request.params.id) {
        const err = new Error('Id is missing')
        err.nmae = ErrorCode.ValidationError
        next(err)
    }
    var reqBody = request.body
    const result = await Blog.updateOne(
        { _id: request.params.id },
        {
            title: reqBody.title,
            author: reqBody.author,
            url: reqBody.url,
            likes: reqBody.likes
        },
        opts)
    logger.log('result is ', result)
    if (result.matchCount === 0) {
        var err = new Error('id not found')
        err.name = ErrorCode.IdNotFound
        return next(err)
    }
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
