const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const ErrorCode = require('../models/errorCodes')
const logger = require('../utils/logger')
const User = require('../models/user')
const opts = { runValidators: true }
const config = require('../utils/config')
//we cheat by copying from lessons
const jwt = require('jsonwebtoken')

/**
 * User or Error
 */
const getAndValidateToken = async (request) => {
    const error = new Error('Invalid Token')
    error.code = ErrorCode.TokenExpiredError
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.replace('Bearer ', '')
        const decodedToken = jwt.verify(token, config.Secret)
        if (!decodedToken.id) {
            return {
                user: null,
                error: error
            }
        }
        const user = await User.findById(decodedToken.id)
        return {
            user: user,
            error: error
        }
    }
    return {
        user: null,
        error: error
    }
}

blogRouter.get('/', async (request, response) => {

    const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1,
    })
    response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
    logger.log('Received at Post /', request.body)
    var error = isValid(request.body)
    if (error) {
        return next(error)
    }
    const body = request.body
    const validate = getAndValidateToken(request)
    if (validate.error) {
        return next(validate.error)
    }
    const user = validate.user
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
