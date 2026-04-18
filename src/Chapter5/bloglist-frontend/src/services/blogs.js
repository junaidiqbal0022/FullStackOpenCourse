import axios from 'axios'
const baseUrl = 'http://localhost:3001/api'

let token = ''
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getHeader = () => ({
  headers: { Authorization: token },
})

const getAll = async () => {
  const res = await axios.get(`${baseUrl}/blogs`, getHeader())
  return res.data
}

const updateBlogs = async (blog) => {
  const res = await axios.put(`${baseUrl}/blogs/${blog.id}`, blog, getHeader())
  return res.data
}

const login = async (username, password) => {
  const req = axios.post(`${baseUrl}/login`, { username, password })
  const res = await req
  return res.data
}

const create = async (author, title, url) => {
  const blog = {
    author: author,
    title: title,
    url: url,
    likes: 1000,
  }
  const res = await axios.post(`${baseUrl}/blogs`, blog, getHeader())
  return res.data
}

const deleteBlog = async (id) => {
  const res = await axios.delete(`${baseUrl}/blogs/${id}`, getHeader())
  return res.data
}

export default { getAll, login, setToken, create, updateBlogs, deleteBlog }
