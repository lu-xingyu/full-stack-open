const lodash  = require('lodash');
const dummy = (blogs) => {
    return 1
}


const totalLikes = (blogs) => {
    return blogs.reduce(
        (sum, blog) => sum = sum + blog.likes
        , 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce(
        (maxBlog, blog) => {
            return maxBlog.likes >= blog.likes ? maxBlog  : blog
        }
    )
}

const mostBlogs = (blogs) => {
    const blogsByAuthor = blogs.reduce(
        (count, blog) => {
            count[blog.author] = (count[blog.author] || 0) + 1
            return count
        }
        , {}
    )

    let maxBlogs = 0
    let maxAuthor
    for (author in blogsByAuthor) {
        if (blogsByAuthor[author] >= maxBlogs) {
            maxBlogs = blogsByAuthor[author]
            maxAuthor = author
        }
    }

    const result = {
        author: maxAuthor,
        blogs: maxBlogs
    }
    return result
}

const mostLikes = (blogs) => {
    const blogsByAuthor = lodash.groupBy(blogs, 'author')
    const likesByAuthor = lodash.mapValues(blogsByAuthor, 
        (blogList) => {
            return lodash.sumBy(blogList, blog => blog.likes)
        }
    )
    const maxEntry = lodash.maxBy(Object.entries(likesByAuthor), ([k, v]) => v)
    const maxAuthor = {
        'author': maxEntry[0],
        'likes': maxEntry[1]
    }
    return maxAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}