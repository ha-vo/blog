import express from 'express'
import api from './router/initWebApp.js'
import path from 'path'
import { fileURLToPath } from 'url'
import db from './config/db/index.js'
import methodOverride from 'method-override'
import bodyParser from 'body-parser'

const app = express()
const port = 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

db.connect()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    next()
})

api.initWebApp(app)
api.posts(app)

// app.use(methodOverride('X-HTTP-Method-Override'))

app.listen(port, () => {
    console.log(`Web running at http://localhost:${port}`)
})