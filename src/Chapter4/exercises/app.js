const mongoose = require('mongoose')
const express = require('express')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const configs = require('./utils/config')
const tokenVerifier = require('./utils/tokenvalidator')
const cors = require('cors')
const app = express()
app.use(cors())
const url = configs.MongoDb_Url
logger.info(url)
mongoose
    .connect(url, { family: 4 })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })

//app.use(express.static('dist'));
app.use(express.json())
app.use(middleware.requstLogger)
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)

app.use(tokenVerifier.getAndDecodeToken)
app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
