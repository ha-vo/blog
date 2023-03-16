import express from 'express'
import controllers from '../controller/redirect.js'
import bodyParser from 'body-parser'

const router = express.Router()
const routerPosts = express.Router()

const initWebApp = function (app) {
    router.get('/', controllers.getLoginPage)
    router.post('/', controllers.addCookie, controllers.getHomePage)
    router.get('/home', controllers.checkLogin, controllers.getHomePage)
    app.use('/', router)
}

const posts = function (app) {
    routerPosts.get('/showControll', controllers.checkLogin, controllers.getControllerPages)
    routerPosts.get('/updatePosts/:id', controllers.checkLogin, controllers.getPage)
    routerPosts.get('/:id', controllers.checkLogin, controllers.getPost)
    routerPosts.get('/', controllers.checkLogin, controllers.getCreatePages)
    routerPosts.post('/create', controllers.checkLogin, controllers.create)
    routerPosts.put('/:id', controllers.checkLogin, controllers.update)
    routerPosts.delete('/:id', controllers.checkLogin, controllers.deletePost)
    app.use('/posts', controllers.checkLogin, routerPosts)
}

export default {
    initWebApp, posts
}