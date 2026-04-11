const lodash = require('lodash')
const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return 0
    }
    return blogs.reduce((total, current) => total + current.likes, 0)
}
const favoriteBlog = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return
    }
    let max = blogs[0]
    for (const blog in blogs) {
        if (max.likes > blog.likes) {
            max = blog
        }
    }
    return max
}

const mostBlogs = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return
    }
    return lodash(blogs).chain()
        .groupBy(x => x.author)
        .map((items, author) => ({
            author,
            blogs: items.length
        })).maxBy(b => b.blogs).value()
}

const favoriteAuthor = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return
    }
    return lodash(blogs)
        .chain()
        .groupBy(item => item.author)
        .map((items, author) => ({
            author,
            likes: lodash.sumBy(items, item => item.likes)
        })).maxBy(item => item.likes).value()

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    favoriteAuthor
}