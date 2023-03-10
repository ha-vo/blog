import express from 'express'
import controllers from '../controller/redirect.js'

const router = express.Router()
const routerPosts = express.Router()

const initWebApp = function (app) {
    router.get('/', controllers.getHomePage)
    app.use('/', router)
}

const posts = function (app) {
    routerPosts.get('/', controllers.getCreatePages)
    routerPosts.post('/create', controllers.create)
    routerPosts.get('/showControll', controllers.getControllerPages)
    app.use('/posts', routerPosts)
}


export default {
    initWebApp, posts
}