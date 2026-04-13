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
    test('we try logging in', async () => {
        const resp = await api
            .post('/api/login')
            .send({
                'username': helper.user1.username,
                'password': helper.user1.password
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(resp.body.username, helper.user1.username)
    })
    test('we try logging in with wrong password', async () => {
        const resp = await api
            .post('/api/login')
            .send({
                'username': helper.user1.username,
                'password': 'wrong'
            })
            .expect(401)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(resp.body.error, 'invalid username or password')
    })
})