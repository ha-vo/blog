import express from 'express'
import controllers from '../controller/redirect.js'
import bodyParser from 'body-parser'

const router = express.Router()
const routerPosts = express.Router()

const initWebApp = function (app) {
    router.get('/', controllers.getHomePage)
    app.use('/', router)
}

const posts = function (app) {
    routerPosts.get('/showControll', controllers.getControllerPages)
    routerPosts.get('/updatePosts/:id', controllers.getPage)
    routerPosts.get('/:id', controllers.getPost)
    routerPosts.get('/', controllers.getCreatePages)
    routerPosts.post('/create', controllers.create)
    routerPosts.put('/:id', controllers.update)
    routerPosts.delete('/:id', controllers.deletePost)
    app.use('/posts', routerPosts)
}

export default {
    initWebApp, posts
}