const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('./dummies/dummy')
const blogs = require('./testInput').blogs
describe('We are dummy testing', () => {
    test('dummy returns one', () => {
        const blogs = []

        const result = listHelper.dummy(blogs)
        assert.strictEqual(result, 1)
    })
})
describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0,
        },
    ]

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test(`when list has only ${blogs.length} blog, equals the likes of that`, () => {
        var total = 0
        blogs.forEach((item) => (total += item.likes))
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, total)
    })
})

describe('favorite blog', () => {
    test('favorite blog is', () => {
        var likes = blogs.sort((first, second) => first.likes - second.likes)
        assert.deepStrictEqual(likes[0], listHelper.favoriteBlog(blogs))
    })
})
describe('most busy author', () => {
    test('most blogs by', () => {
        assert.deepStrictEqual(
            {
                author: 'Robert C. Martin',
                blogs: 3,
            },
            listHelper.mostBlogs(blogs),
        )
    })
})

describe('favorite author', () => {
    test('favorite author is', () => {
        assert.deepStrictEqual(
            {
                author: 'Edsger W. Dijkstra',
                likes: 17,
            },
            listHelper.favoriteAuthor(blogs),
        )
    })
})
