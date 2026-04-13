const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const ErrorCode = require('../models/errorCodes')
const logger = require('../utils/logger')
const opts = { runValidators: true }
const validator = require('../utils/tokenvalidator')


blogRouter.get('/', async (request, response, next) => {
    logger.log('Received at Post /', request.body)
    try {
        response.json(await validator.getUserWithBlog(request.user))
    }
    catch (error) {
        return next(error)
    }
})

blogRouter.post('/', async (request, response, next) => {
    logger.log('Received at Post /', request.body)
    var error = isValid(request.body)
    if (error) {
        return next(error)
    }
    const body = request.body
    var user = await validator.getUserWithBlog(request.user)
    logger.info(user)
    try {
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes ?? 0,
            user: user._id
        })
        const result = await blog.save()
        user.blogs = user.blogs.concat(result._id)
        await user.save()
        response.status(201).json(result)
    }
    catch (error) {
        next(error)
    }

})

blogRouter.delete('/:id', async (request, response, next) => {
    logger.log('Received at delete for id', request.params.id)
    if (!request.params.id) {
        const err = new Error('Id is missing')
        err.nmae = ErrorCode.ValidationError
        return next(err)
    }
    const user = await validator.getUserWithBlog(request.user)
    if (!user.blogs.some(f => f._id.toString() === request.params.id)) {
        var error = new Error('You do not have persmissions to delete this')
        error.name = ErrorCode.InsufficientPrivilages
        return next(error)
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
    const user = await validator.getUserWithBlog(request.user)
    if (!user.blogs.some(f => f._id.toString() === request.params.id)) {
        var error = new Error('You do not have persmissions to delete this')
        error.name = ErrorCode.InsufficientPrivilages
        return next(error)
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
    response.status(204).end()
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
