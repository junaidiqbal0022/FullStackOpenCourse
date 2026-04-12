const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const testHelper = require('./test_helper')
const api = supertest(app)
const lodash = require('lodash')
const sampleBlogs = testHelper.sampleBlogs
beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')
    const blogs = sampleBlogs.map((b) => new Blog(b))
    await Blog.insertMany(blogs)

    console.log('all saved')
})

after(async () => {
    await mongoose.connection.close()
})
test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, sampleBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map((e) => e.title)
    assert.strictEqual(titles.includes(sampleBlogs[0].title), true)
})

test('a valid blog can be added ', async () => {
    const newblog = {
        title: 'React patterns are strange',
        author: 'Michael Chan B.',
        url: 'https://reactpatterns.com/',
        likes: 100,
    }

    await api
        .post('/api/blogs')
        .send(newblog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map((r) => r.title)

    assert.strictEqual(response.body.length, sampleBlogs.length + 1)

    assert(titles.includes(newblog.title))
})

test('blog without content is not added', async () => {
    const newblog = {
        author: 'my auther',
    }

    await api.post('/api/blogs').send(newblog).expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, sampleBlogs.length)
})

test('uniuqe entity id is named id', async () => {
    const response = await api.get('/api/blogs')
    console.log('response is', response)
    assert.strictEqual(
        lodash.every(response.body, (obj) => 'id' in obj && obj.id !== null),
        true,
    )
    assert.strictEqual(
        lodash.every(response.body, (obj) => !('_id' in obj)),
        true,
    )
    var unique = lodash.uniqBy(response.body, (item) => item.id)
    assert.strictEqual(response.body.length, unique.length)
})

test('Missing likes default to 0', async () => {
    const newblog = {
        title: 'We test missing like',
        author: 'Michael Chan B.',
        url: 'https://reactpatterns.com/',
    }
    await api
        .post('/api/blogs')
        .send(newblog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    var ourBlog = response.body.filter((f) => f.title.trim() === newblog.title.trim())[0]
    assert.strictEqual(response.body.length, sampleBlogs.length + 1)
    assert.strictEqual('likes' in ourBlog, true)
    assert.strictEqual(ourBlog.likes, 0)
})

test('ValidationErrors (EX4.12)', async () => {
    const newblog1 = {
        author: 'Michael Chan B.',
        url: 'https://reactpatterns.com/',
    }
    const newblog2 = {
        title: 'time to disco',
        author: 'Michael Chan B.',
    }
    await api
        .post('/api/blogs')
        .send(newblog1)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    await api
        .post('/api/blogs')
        .send(newblog2)
        .expect(400)
        .expect('Content-Type', /application\/json/)

})
