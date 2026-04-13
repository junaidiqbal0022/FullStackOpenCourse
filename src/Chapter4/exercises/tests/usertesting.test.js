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
        await helper.deleteAllUsers()
        await helper.addUsertoDb(helper.user1)
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        await api
            .post('/api/users')
            .send(helper.user2)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(helper.user2.username))
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

        await api
            .post('/api/users')
            .send(helper.user1)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(helper.user1.username))
    })

    test('Username is missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
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

    test('Password is missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'timo',
            name: 'Mali',
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

    test('Name is missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'timo',
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

    test('get users', async () => {
        const usersAtStart = await helper.usersInDb()

        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = response.body
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(helper.user1.username))

        const blogs = usersAtEnd.map(p => p.blogs).flat()
        assert.strictEqual(blogs.length, 0)


    })
})
describe('Users have blogs', () => {
    beforeEach(async () => {
        await helper.deleteAllUsers()
        await helper.deleteAllBlogs()
        await helper.addUsertoDb(helper.user1)
    })

    test('get users without blogs', async () => {
        const usersAtStart = await helper.usersInDb()

        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = response.body
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(helper.user1.username))

        const blogs = usersAtEnd.map(p => p.blogs).flat()
        assert.strictEqual(blogs.length, 0)


    })

    test('get users with blogs', async () => {
        await helper.addUsertoDb(helper.user2)
        await helper.createBlogsForUser(api, helper.user2, helper.user2Blogs)
        const usersAtStart = await helper.usersInDb()

        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = response.body
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(helper.user2.username))

        const blogs = usersAtEnd.map(p => p.blogs).flat()
        assert.strictEqual(blogs.length, helper.user2Blogs.length)
    })
})