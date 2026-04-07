const express = require('express');
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
    response.json(phoneBook)
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    if (!id) {
        return response.status(400).json({ error: 'ID missing' })
    }

    const contact = phoneBook.find(c => c.id === id)
    response.json(contact)
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    if (!id) {
        return response.status(400).json({ error: 'ID missing' })
    }
    phoneBook = phoneBook.filter(contact => contact.id !== id)

    response.status(204).end()
});

const generateId = () => {
    return Math.ceil(Math.random(0, 1_0000_000_000) * 1_0000_000_000).toString();
    // const maxId = phoneBook.length > 0
    //     ? Math.max(...phoneBook.map(c => Number(c.id)))
    //     : 0
    // return String(maxId + 1)
}

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
    if (phoneBook.some(c => c.name === body.name)) {
        return response.status(400).json({
            error: 'name already exists'
        })
    }

    const contact = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    phoneBook = phoneBook.concat(contact)

    response.json(contact)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})