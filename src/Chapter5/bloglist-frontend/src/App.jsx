import { useEffect, useState } from 'react'
import Blogs from './components/Blogs'
import Login from './components/login'
import services from './services/blogs'
import ToggleBlogForm from './components/ToggleBlogForm'

const App = () => {
  const [user, setUser] = useState()
  const [ready, setReady] = useState(false)
  const [blogs, setBlogs] = useState([])
  const onLogout = () => {
    console.log('onLogout')
    setUser()
  }
  useEffect(() => {
    console.log('user is ', user?.name)
    services.setToken(user?.token)
    setReady(!!user)
  }, [user])

  return (
    <div style={{ marginLeft: 50 }}>
      {!ready && <Login setUser={setUser} />}
      {ready && (
        <>
          <h2>blogs</h2>
          {user ? (
            <h6 style={{ fontSize: 18 }}>
              {user.name} is logged in{' '}
              <button onClick={onLogout}>logout</button>
            </h6>
          ) : (
            'No user logged in, you should not be seeing this page at all'
          )}
          <ToggleBlogForm
            blogs={blogs}
            setBlogs={setBlogs}
            bloServices={services}
          />
          <Blogs
            user={user}
            blogs={blogs}
            setBlogs={setBlogs}
            onLogout={onLogout}
            blogService={services}
          />
        </>
      )}
    </div>
  )
}

export default App
