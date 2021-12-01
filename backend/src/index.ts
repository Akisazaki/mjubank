import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import serveStatic from 'serve-static'
import { createConnection } from 'typeorm'
import api from './api'
import { authentication } from './api/authentication'
import dbConfig from './db-config'

dotenv.config()


const whitelist = [
  'localhost'
]


const port = 8000

const app = express()

app.use(serveStatic(path.join(__dirname, '../public')))
app.use(cors({
  origin: function (origin, callback) {
    return callback(null, true)
    // if (!origin || whitelist.indexOf(origin) !== -1) {
    //   callback(null, true)
    // } else {
    //   callback(new Error("Not allowed by CORS"))
    // }
  },
  credentials: true
}))
// app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.get('/', (req, res) => {
  res.send('<html><title>Hello</title><body>Hello World!</body></html>')
})

createConnection(dbConfig)
  .then(connection => {
    app.set('db', connection)
    authentication(connection, app)
    app.use('/api', api(connection))
    app.listen(port, () => {
      console.log('server started at http://localhost:' + port)
    })
  })
  .catch(err => console.error(err))
