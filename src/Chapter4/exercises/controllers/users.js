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
    const { username, name, password } = request.body
    if (password.length < 3) {
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
    try {
        var savedUser = await user.save()
    }
    catch (error) {
        if (error.message.includes('E11000 duplicate key error')) {
            error.name = ErrorCode.ValidationError
        }
        return next(error)
    }

    response.status(201).json(savedUser)
})

module.exports = userRouter