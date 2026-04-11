const express = require('express')
const mango = require('./models/mango')
const errorCodes = require('./helpers/errorCodes')
//const cors = require('cors')
require('dotenv').config()

//morgan
var morgan = require('morgan')
morgan(':method :url :status :request - :response-time ms')
// EXAMPLE: only log error responses
const app = express()
app.use(express.json())
app.use(express.static('dist'))
//leaving cors here to avoid adding/removing when switching between frontend and backend development.
//app.use(cors())

var logger = morgan(function (tokens, req, res) {
  return [
    new Date().toISOString(),
    req.method,
    req.url,
    res.statusCode,
    res.get('Content-Length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    JSON.stringify(req.body),
  ].join(' ')
})
app.use(logger)

app.get('/', (request, response) => {
  response.send(
    '<h1>Welcom to Phone Book! This is radio station Tampere and today is: </br>' +
      new Date() +
      '</h1>',
  )
})

app.get('/api/info', (request, response, next) => {
  return mango
    .getData()
    .then((result) => {
      response.json(
        `Welcome To Phone, Currently ${result.length} people in the phone book, at ${new Date()}`,
      )
    })
    .catch((error) => {
      error.name = errorCodes.InternalServerError
      next(error)
    })
})

app.get('/api/persons', (request, response, next) => {
  return mango
    .getData()
    .then((result) => {
      if (!result || result.length === 0) {
        const err = new Error('No data found in database')
        err.name = errorCodes.NotFound
        next(err)
      }
      response.json(result)
    })
    .catch((error) => {
      error.name = errorCodes.InternalServerError
      next(error)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  if (!id) {
    const error = new Error('Id is Missing')
    error.name = errorCodes.ValidationError
    next(error)
  }
  return mango
    .getDataById(id)
    .then((result) => {
      if (result) {
        response.json(result)
      } else {
        const error = new Error(`No person found with ID ${id}`)
        error.name = errorCodes.IdNotFound
        next(error)
      }
    })
    .catch((error) => {
      error.name = errorCodes.InternalServerError
      next(error)
    })
})

app.get('/api/persons/name/:name', (request, response, next) => {
  const name = request.params.name
  if (!name) {
    const error = new Error('Name is Missing')
    error.name = errorCodes.ValidationError
    next(error)
  }
  return mango
    .getDataByName(name)
    .then((result) => {
      if (result) {
        response.json(result)
      } else {
        const error = new Error(`No person found with name ${name}`)
        error.name = errorCodes.IdNotFound
        next(error)
      }
    })
    .catch((error) => {
      error.name = errorCodes.InternalServerError
      next(error)
    })
})

//only for testing purposes, not allowed in production
app.post('/api/persons/temp', (request, response, next) => {
  console.log('Received DELETE request for all data')
  const error = new Error('Bulk delete is not allowed')
  error.name = errorCodes.BulkDeleteNotAllowed
  next(error)
})
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  console.log(`Received DELETE request for ID: ${id}`)
  if (!id) {
    const error = new Error('Id is Missing')
    error.name = errorCodes.ValidationError
    next(error)
  }
  return mango
    .deleteData(id)
    .then((result) => {
      if (result) {
        response.status(204).end()
      } else {
        const error = new Error(`No person found with ID ${id}`)
        error.name = errorCodes.IdNotFound
        next(error)
      }
    })
    .catch((error) => {
      error.name = errorCodes.InternalServerError
      next(error)
    })
})

app.delete('/api/persons/delete/:id', (request, response, next) => {
  const id = request?.params?.id
  console.log(`Received DELETE request for ID: ${id}`)

  return mango
    .deleteData(id)
    .then((result) => {
      if (result) {
        response.status(204).end()
      } else {
        const error = new Error(`No person found with ID ${id}`)
        error.name = errorCodes.IdNotFound
        next(error)
      }
    })
    .catch((error) => {
      error.name = errorCodes.InternalServerError
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body
  console.log(`Received PUT request for ID: ${id} with body:`, body)
  if (!body) {
    const error = new Error('Request body is missing')
    error.name = errorCodes.ValidationError
    next(error)
  }
  if (!id) {
    const error = new Error('Id is Missing')
    error.name = errorCodes.ValidationError
    next(error)
  }
  if (!body.number) {
    const error = new Error('Number missing in request body')
    error.name = errorCodes.ValidationError
    next(error)
  }
  if (!body.name) {
    const error = new Error('Name missing in request body')
    error.name = errorCodes.ValidationError
    next(error)
  }
  return mango
    .updateData(id, body.name, body.number)
    .then((result) => {
      if (result) {
        response.json(result)
      } else {
        const error = new Error(`No person found with ID ${id}`)
        error.name = errorCodes.IdNotFound
        next(error)
      }
    })
    .catch((error) => {
      error.name = errorCodes.InternalServerError
      next(error)
    })
})

app.put('/api/persons/update/:id', (request, response, next) => {
  const id = request?.params?.id
  const body = request?.body
  console.log(`Received PUT request for ID: ${id} with body:`, body)

  return mango
    .updateData(id, body?.name, body?.number)
    .then((result) => {
      if (result) {
        response.json(result)
      } else {
        const error = new Error(`No person found with ID ${id}`)
        error.name = errorCodes.IdNotFound
        next(error)
      }
    })
    .catch((error) => {
      error.name = errorCodes.InternalServerError
      next(error)
    })
})

app.post('/api/persons/add', (request, response, next) => {
  const body = request?.body
  console.log('Received POST request with body:', body)
  mango
    .writeData({
      name: body?.name,
      number: body?.number,
    })
    .then((result) => {
      if (result) {
        response.json(result)
      } else {
        const error = new Error(
          `Person with the same name ${body.name} already exists`,
        )
        error.name = errorCodes.DuplicateEntry
        next(error)
      }
    })
    .catch((error) => {
      error.name = errorCodes.InternalServerError
      next(error)
    })
})

app.post('/api/persons/', (request, response, next) => {
  const body = request.body

  if (!body) {
    const error = new Error('Request body is missing')
    error.name = errorCodes.ValidationError
    next(error)
  }
  if (!body.name) {
    const error = new Error('Name missing in request body')
    error.name = errorCodes.ValidationError
    next(error)
  }
  if (!body.number) {
    const error = new Error('Number missing in request body')
    error.name = errorCodes.ValidationError
    next(error)
  }
  console.log('Received POST request with body:', body)
  mango
    .writeData({
      name: body.name,
      number: body.number,
    })
    .then((result) => {
      if (result) {
        response.json(result)
      } else {
        const error = new Error(
          `Person with the same name ${body.name} already exists`,
        )
        error.name = errorCodes.DuplicateEntry
        next(error)
      }
    })
    .catch((error) => {
      error.name = errorCodes.InternalServerError
      next(error)
    })
})
app.use(errorCodes.unknownEndpoint)

app.use(errorCodes.errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
