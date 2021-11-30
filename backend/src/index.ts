import express from 'express'
import path from 'path'
import serveStatic from 'serve-static'
import { createConnection } from 'typeorm'
import api from './api'
import dbConfig from './db-config'
import usePassport from './utils/authentication'

const port = 8000

const app = express()

app.use(serveStatic(path.join(__dirname, '../public')))
// app.use(cookieParser())
// app.use(expressSession({
//   secret: 'VCXLV9gsz_y$U<e>}5"q{w5?pd}=2qh!^dp%fcK!7~wL<cL:+t;gbF]>#PGx_-H!',
//   resave: true,
//   saveUninitialized: true
// }))
app.use(express.json())
app.get('/', (req, res) => {
  res.send('<html><title>Hello</title><body>Hello World!</body></html>')
})


createConnection(dbConfig)
  .then(connection => {
    usePassport(connection)
    app.use('/api', api(connection))
    app.listen(port, () => {
      console.log('server started at http://localhost:' + port)
    })
  })
  .catch(err => console.error(err))
