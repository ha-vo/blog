import express from 'express'
import controllers from '../controller/redirect.js'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import user from '../model/user.js'

const router = express.Router()
const routerPosts = express.Router()
passport.use(new LocalStrategy(
    function (username, password, done) {
        user.findOne({ username, password })
            .then(data => {
                if (data) return done(null, data)
                return done(null, false)
            }).catch(err => done(err))
    }
))
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

const initWebApp = function (app) {
    router.get('/', controllers.getLoginPage)
    router.post('/',
        passport.authenticate('local', { failureRedirect: '/' }), controllers.passPortAuthen, controllers.getHomePage)
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