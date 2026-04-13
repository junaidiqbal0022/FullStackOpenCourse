const jwt = require('jsonwebtoken')
const ErrorCode = require('../models/errorCodes')
const config = require('./config')
const User = require('../models/user')

const getAndDecodeToken = async (request, response, next) => {
    const error = {
        errorCode: ErrorCode.InvalidToken,
        error:
            'Invalid Token',
    }
    try {

        const authorization = request.get('authorization')
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return response.status(401).json({ error: error })
        }
        const token = authorization.replace('Bearer ', '')
        const decodedToken = jwt.verify(token, config.Secret)
        if (!decodedToken.id) {
            return response.status(401).json({ error: error })
        }
        request.token = decodedToken
        request.user = await getUser(decodedToken)
        next()
    }
    catch (error) {
        next(error)
    }
}

const getUserWithBlog = async (user) => {
    return await User.findById(user._id).populate('blogs', {
        author: 1,
        title: 1,
        url: 1,
        likes: 1,
        _id: 1
    })

}
const getUser = async (decodedToken) => {
    const user = await User.findById(decodedToken.id)
    return user

}
module.exports = { getAndDecodeToken, getUser, getUserWithBlog }