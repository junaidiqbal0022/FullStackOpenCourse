const Blogs = require('../models/blogs')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const user1Blogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    }
]
const user2Blogs = [
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    },
]
const user1 = {
    username: 'viper',
    name: 'I the Viper',
    password: 'secret'
}
const user2 = {
    username: 'theviper',
    name: 'I the Viper',
    password: 'supersecret'
}

const nonExistingId = async () => {
    const note = new Blogs({ content: 'willremovethissoon' })
    await note.save()
    await note.deleteOne()

    return note._id.toString()
}

const dataInDb = async () => {
    const notes = await Blogs.find({})
    return notes.map((note) => note.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const login = async (api, user) => {
    const resp = await api
        .post('/api/login')
        .send({
            'username': user.username,
            'password': user.password
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    return resp.body
}

const addUsertoDb = async (user) => {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const newUser = new User({
        username: user.username,
        name: user.name,
        passwordHash
    })
    await newUser.save()
}

const signUp = async (api, user) => {
    const newUser = new User({
        username: user.username,
        name: user.name,
        password: user.password
    })
    const resp = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    return resp.body
}
const deleteAllUsers = async () => {
    await User.deleteMany({})
}
const deleteAllBlogs = async () => {
    await Blogs.deleteMany({})
}

const createBlogsForUser = async (api, user, blogs) => {
    const token = await login(api, user)
    for (const blog of blogs) {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token.token}`)
            .send(blog)
    }
}

module.exports = {
    user1Blogs,
    user2Blogs,
    nonExistingId,
    dataInDb,
    usersInDb,
    login,
    user1,
    user2,
    addUsertoDb,
    signUp,
    deleteAllUsers,
    deleteAllBlogs,
    createBlogsForUser
}

