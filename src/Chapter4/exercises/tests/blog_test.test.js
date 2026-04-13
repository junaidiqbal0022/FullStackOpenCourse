const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const helper = require('./test_helper')
const api = supertest(app)
const lodash = require('lodash')
const user1Blogs = helper.user1Blogs
const user2Blogs = helper.user2Blogs
beforeEach(async () => {
    await helper.deleteAllBlogs()
    await helper.deleteAllUsers()
    await helper.addUsertoDb(helper.user1)
    await helper.addUsertoDb(helper.user2)
    await helper.createBlogsForUser(api, helper.user1, helper.user1Blogs)
    await helper.createBlogsForUser(api, helper.user2, helper.user2Blogs)
})

after(async () => {
    await mongoose.connection.close()
})
test('blogs are returned as json', async () => {
    const token = await helper.login(api, helper.user1)
    await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const token = await helper.login(api, helper.user1)
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.blogs.length, user1Blogs.length)
})

test('a specific blog is within the returned blogs', async () => {
    const token = await helper.login(api, helper.user1)
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
    const titles = response.body.blogs.map((e) => e.title)
    assert.strictEqual(titles.includes(user1Blogs[0].title), true)
})

test('a valid blog can be added ', async () => {
    const newblog = {
        title: 'React patterns are strange',
        author: 'Michael Chan B.',
        url: 'https://reactpatterns.com/',
        likes: 100,
    }
    const token = await helper.login(api, helper.user1)
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .send(newblog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)

    const titles = response.body.blogs.map((r) => r.title)

    assert.strictEqual(response.body.blogs.length, user1Blogs.length + 1)

    assert(titles.includes(newblog.title))
})

test('blog without content is not added', async () => {
    const newblog = {
        author: 'my auther',
    }

    const token = await helper.login(api, helper.user1)
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .send(newblog)
        .expect(400)

    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)

    assert.strictEqual(response.body.blogs.length, user1Blogs.length)
})

test('uniuqe entity id is named id', async () => {
    const token = await helper.login(api, helper.user1)
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
    console.log('response is', response)
    assert.strictEqual(
        lodash.every(response.body.blogs, (obj) => 'id' in obj && obj.id !== null),
        true,
    )
    assert.strictEqual(
        lodash.every(response.body.blogs, (obj) => !('_id' in obj)),
        true,
    )
    var unique = lodash.uniqBy(response.body.blogs, (item) => item.id)
    assert.strictEqual(response.body.blogs.length, unique.length)
})

test('Missing likes default to 0', async () => {
    const newblog = {
        title: 'We test missing like',
        author: 'Michael Chan B.',
        url: 'https://reactpatterns.com/',
    }
    const token = await helper.login(api, helper.user1)
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .send(newblog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    var ourBlog = response.body.blogs.filter((f) => f.title.trim() === newblog.title.trim())[0]
    assert.strictEqual(response.body.blogs.length, user1Blogs.length + 1)
    assert.strictEqual('likes' in ourBlog, true)
    assert.strictEqual(ourBlog.likes, 0)
})

test('ValidationErrors (EX4.12)', async () => {
    const token = await helper.login(api, helper.user1)

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
        .set('Authorization', `Bearer ${token.token}`)
        .send(newblog1)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .send(newblog2)
        .expect(400)
        .expect('Content-Type', /application\/json/)

})

test('deletion of a blog', async () => {
    const token = await helper.login(api, helper.user1)
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    var blogToDelete = response.body.blogs[0]
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token.token}`)
        .expect(204)

    const response2 = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(response2.body.blogs.length, user1Blogs.length - 1)
    var titles = response2.body.blogs.map((e) => e.title)
    assert.strictEqual(titles.includes(blogToDelete.title), false)
})

test('deletion of a blog fails with 403 if not the creator', async () => {
    const token = await helper.login(api, helper.user1)
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    var blogToDelete = response.body.blogs[0]

    const token2 = await helper.login(api, helper.user2)
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token2.token}`)
        .expect(403)

    const response2 = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(response2.body.blogs.length, user1Blogs.length)
    var titles = response2.body.blogs.map((e) => e.title)
    assert.strictEqual(titles.includes(blogToDelete.title), true)
})

test('updating a blog', async () => {
    const token = await helper.login(api, helper.user1)
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    var blogToUpdate = response.body.blogs[0]
    var updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token.token}`)
        .send(updatedBlog)
        .expect(204)

    const response2 = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    var ourBlog = response2.body.blogs.filter((f) => f.id === blogToUpdate.id)[0]
    assert.strictEqual(ourBlog.likes, blogToUpdate.likes + 1)
})

test('updateing a blog fails with 403 if not the creator', async () => {
    const token = await helper.login(api, helper.user1)
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    var blogToUpdate = response.body.blogs[0]
    var updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    const token2 = await helper.login(api, helper.user2)
    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token2.token}`)
        .send(updatedBlog)
        .expect(403)

    const response2 = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token.token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    var ourBlog = response2.body.blogs.filter((f) => f.id === blogToUpdate.id)[0]
    assert.strictEqual(ourBlog.likes, blogToUpdate.likes)
})


test('adding a blog without token fails with 401', async () => {
    const newblog = {
        title: 'React patterns are strange',
        author: 'John Doe',
        url: 'https://something.com/',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newblog)
        .expect(401)
})
