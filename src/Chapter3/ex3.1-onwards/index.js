const express = require('express');
const mango = require('./models/mango')
require('dotenv').config()
//morgan
var morgan = require('morgan')
morgan(':method :url :status :request - :response-time ms')
// EXAMPLE: only log error responses
const app = express();
app.use(express.json());
app.use(express.static('dist'))
var logger = morgan(function (tokens, req, res) {
    return [
        new Date().toISOString(),
        req.method,
        req.url,
        res.statusCode,
        res.get('Content-Length'),
        '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body),
    ].join(' ')
})
app.use(logger)


app.get('/', (request, response) => {
    response.send('<h1>Welcom to Phone Book! This is radio station Tampere and today is: </br>' + new Date() + '</h1>')
});

app.get('/api/info', (request, response) => {
    response.send('<p>Phone book has info for ' + phoneBook.length + ' people</p><p>' + new Date() + '</p>')
});

app.get('/api/persons', (request, response) => {
    return mango.getData().then((result) => {
        console.log('Data fetched successfully:', result)
        response.json(result)
    }).catch((error) => {
        console.error('Error fetching data:', error)
        response.status(500).json({ error: 'Internal Server Error' })
    }
    )
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    if (!id) {
        return response.status(400).json({ error: 'ID missing' })
    }
    return mango.getDataById(id).then((result) => {
        if (result) {
            response.json(result)
        } else {
            response.status(404).json({ error: 'Person not found' })
        }
    }).catch((error) => {
        console.error('Error fetching data:', error)
        response.status(500).json({ error: 'Internal Server Error' })
    })
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log(`Received DELETE request for ID: ${id}`)
    if (!id) {
        console.error('ID missing in request')
        return response.status(400).json({ error: 'ID missing' })
    }
    return mango.deleteData(id).then((result) => {
        if (result) {
            response.status(204).end()
        } else {
            response.status(404).json({ error: 'Person not found' })
        }
    }).catch((error) => {
        console.error('Error deleting data:', error)
        response.status(500).json({ error: 'Internal Server Error' })
    })
});

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const body = request.body
    console.log(`Received PUT request for ID: ${id} with body:`, body)
    if (!id) {
        console.error('ID missing in request')
        return response.status(400).json({ error: 'ID missing' })
    }
    if (!body || !body.number) {
        console.error('Number missing in request body')
        return response.status(400).json({ error: 'Number missing' })
    }
    return mango.updateData(id, body.number).then((result) => {
        if (result) {
            response.json(result)
        } else {
            response.status(404).json({ error: 'Person not found' })
        }
    }).catch((error) => {
        console.error('Error updating data:', error)
        response.status(500).json({ error: 'Internal Server Error' })
    })

})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    console.log('Received POST request with body:', body)
    mango.writeData({
        name: body.name,
        number: body.number
    }).then((result) => {
        if (result) {
            response.json(result)
        } else {
            response.status(400).json({ error: 'Person with the same name already exists' })
        }
    }).catch((error) => {
        console.error('Error writing data:', error)
        response.status(500).json({ error: 'Internal Server Error' })
    });
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})