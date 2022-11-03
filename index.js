import http from 'http'
import getBodyData from './util.js'
import { v4 } from 'uuid'

let books = [
    { id: '1', title: 'Book n1', pages: 250, author: 'Writer 1' }
]

const server = http.createServer(async (req, res) => {

    if (req.url === '/books' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json charset=utf8' })
        res.end(JSON.stringify({ status: 'OK', books }))
    }

    if (req.url.match(/\/books\/\w+/) && req.method === 'GET') {
        const id = req.url.split('/')[2]
        const book = books.find(book => book.id === id)
        
        res.writeHead(200, { 'Content-Type': 'application/json charset=utf8' })
        res.end(JSON.stringify({ status: 'OK', book }))
    }

    if (req.url === '/books' && req.method === 'POST') {
        const data = await getBodyData(req)
        const { title, pages, author } = JSON.parse(data)
        const newBook = { id: v4(), title, pages, author }
        books.push(newBook)
        
        res.writeHead(200, { 'Content-Type': 'application/json charset=utf8' })
        res.end(JSON.stringify({ status: 'Created', newBook }))
    }

    if (req.url.match(/\/books\/\w+/) && req.method === 'PUT') {
        const id = req.url.split('/')[2]
        const data = await getBodyData(req)
        const { title, pages, author } = JSON.parse(data)

        const ind = books.findIndex(book => book.id === id)
        const changedBook = {
            id: books[ind].id,
            title: title || books[ind].title,
            pages: pages || books[ind].pages,
            author: author || books[ind].author
        }
        books[ind] = changedBook

        res.writeHead(200, { 'Content-Type': 'application/json charset=utf8' })
        res.end(JSON.stringify({ status: 'Updated', changedBook }))
    }

    if (req.url.match(/\/books\/\w+/) && req.method === 'DELETE') {
        const id = req.url.split('/')[2]
        books = books.filter(book => book.id !== id)

        res.writeHead(200, { 'Content-Type': 'application/json charset=utf8' })
        res.end(JSON.stringify({ status: 'Deleted' }))
    }

})

server.listen(3000, _ => console.log('Server is running on port 3000'))