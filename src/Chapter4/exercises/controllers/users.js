const userRouter = require('express').Router()
const User = require('../models/user')
const ErrorCode = require('../models/errorCodes')
const logger = require('../utils/logger')
const opts = { runValidators: true }
const bcrypt = require('bcrypt')
userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {
        author: 1,
        title: 1,
        url: 1,
        likes: 1
    })
    return response.json(users)
})

userRouter.post('/', async (request, response, next) => {
    try {
        const { username, name, password } = request.body
        if (!password || password.length < 3) {
            var error = new Error('Password should be longer than 3 char')
            error.name = ErrorCode.ValidationError
            return next(error)

        }
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            name,
            passwordHash,
        })
        var savedUser = await user.save()
        response.status(201).json(savedUser)
    }
    catch (error) {
        error.name = ErrorCode.ValidationError
        return next(error)
    }
})
//for testing purposes only
userRouter.delete('/', async (request, response, next) => {
    try {
        await User.deleteMany({})
        response.status(204).end()
    } catch (error) {
        return next(error)
    }
})

module.exports = userRouter