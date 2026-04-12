const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
after(async () => {
    await mongoose.connection.close()
})
describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({
            username: 'root',
            name: 'Something',
            passwordHash
        })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('name is not valid', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'timo',
            name: 'Ma',
            password: 'polite',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        assert(!usernames.includes(newUser.username))
    })

    test('Password is not valid', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'timo',
            name: 'Mali',
            password: 'en',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        assert(!usernames.includes(newUser.username))
    })
    test('Username is not valid', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ti',
            name: 'Mali',
            password: 'polite',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        assert(!usernames.includes(newUser.username))
    })
    test('Username is not unique', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'timo',
            name: 'Mali',
            password: 'polite',
        }

        const newUser2 = {
            username: 'timo',
            name: 'Mali',
            password: 'polite',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        await api
            .post('/api/users')
            .send(newUser2)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })
})