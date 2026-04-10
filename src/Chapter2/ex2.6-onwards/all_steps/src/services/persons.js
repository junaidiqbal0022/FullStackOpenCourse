import axios from 'axios'
const baseUrl = '/api/persons'
//const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getByName = (name) => {
    const request = axios.get(`${baseUrl}/name/${name}`)
    return request.then(response => response.data)
}
const create = async newObject => {
    const request = axios.post(`${baseUrl}/add`, newObject)
    const response = await request
    return response.data
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/update/${id}`, newObject)
    return request.then(response => response.data)
}

const deleteId = (id) => {
    const request = axios.delete(`${baseUrl}/delete/${id}`)
    return request.then(response => response.data)
}
export {
    getAll, create, update, deleteId, getByName
}