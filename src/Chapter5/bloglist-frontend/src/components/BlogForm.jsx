import { useState } from 'react'
import Notify from './Notify'

const BlogForm = ({ bloServices, blogs, setBlogs }) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')
  const [error, setError] = useState('')
  const [color, setColor] = useState('')
  const onFormSubmit = async (e) => {
    e.preventDefault()
    if (!author || author.trim === '') {
      setError('Author is empty')
      return
    }
    if (!url || url.trim === '') {
      setError('url is empty')
      return
    }
    if (!title || title.trim === '') {
      setError('title is empty')
      return
    }
    try {
      const resp = await bloServices.create(author, title, url)
      console.log(resp)
      var newBlog = {
        author: resp.author,
        title: resp.title,
        url: resp.url,
        likes: resp.likes,
        id: resp.id,
      }
      const newCopy = [...blogs.blogs, newBlog]
      setBlogs({
        ...blogs,
        blogs: newCopy.sort((a, b) => b.likes - a.likes),
      })
      setError(`New Blogs ${resp.title}! by ${blogs.name} Added`)
      setColor('green')
      setTimeout(() => {
        setError('')
        setColor('')
      }, 5000)
      setAuthor('')
      setTitle('')
      setUrl('')
    } catch (err) {
      console.log('error', err)
      setColor('red')
      setError(`Error: ${err.name} ${err.message}`)
    }
  }
  return (
    <>
      <h5>Create New Blog</h5>
      <Notify msg={error} color={color} />
      <form
        onSubmit={onFormSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <label style={{ display: 'flex', gap: '10px' }}>
          Title:
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>

        <label style={{ display: 'flex', gap: '10px' }}>
          Author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
        <label style={{ display: 'flex', gap: '10px' }}>
          Url:
          <input
            type="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
        <button type="submit" style={{ width: 100 }}>
          create
        </button>
      </form>
    </>
  )
}
export default BlogForm
