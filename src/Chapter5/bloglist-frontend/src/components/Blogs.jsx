import { useState, useEffect, useRef } from 'react'
import Blog from './Blog'
import Notify from './Notify'

const Blogs = ({ blogService, blogs, setBlogs }) => {
  const [error, setError] = useState()
  const [color, setColor] = useState('red')

  useEffect(() => {
    const getData = async () => {
      try {
        console.log('We try get data now')
        const data = await blogService.getAll()
        const dataSorted = {
          ...data,
          blogs: data.blogs.sort((a, b) => b.likes - a.likes),
        }

        console.log('Blogs:', data)
        setBlogs(dataSorted)
      } catch (err) {
        console.log(`error ${err}`)
        setError(`Error: ${err.name} ${err.message}`)
        setColor('red')
      }
    }
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogService])
  const timeoutRef = useRef(null)

  const setErrorWithTimeout = (msg, color = 'green') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setError(msg)
    setColor(color)
    timeoutRef.current = setTimeout(() => {
      setError('')
    }, 5000)
  }
  return (
    <div>
      <Notify msg={error} color={color} />

      {blogs?.blogs?.length > 0 ? (
        <>
          <h3>
            {blogs.name +
              ' has written total of: ' +
              blogs.blogs.length +
              ' blogs.'}
          </h3>
          <hr
            style={{
              border: '1px solid #000000',
              margin: '10px 0',
              width: '60%',
              justifyContent: 'left',
              alignItems: 'left',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            {blogs.blogs.map((blog) => (
              <div key={blog.id}>
                <Blog
                  setErrorWithTimeout={setErrorWithTimeout}
                  blog={blog}
                  blogServices={blogService}
                  setBlogs={setBlogs}
                />
                <hr
                  style={{
                    border: '1px solid #ddd',
                    margin: '10px 0',
                    width: '50%',
                    justifyContent: 'left',
                    alignItems: 'left',
                  }}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ marginTop: 20 }}>No blogs to Display</div>
      )}
    </div>
  )
}

export default Blogs
