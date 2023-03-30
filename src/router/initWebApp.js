import express from 'express'
import controllers from '../controller/redirect.js'
import passportLocal from 'passport'
import passportFacebook from 'passport'
import LocalStrategy from 'passport-local'
import FacebookStrategy from 'passport-facebook'
import user from '../model/user.js'
import lesson from '../model/lesson.js'

const router = express.Router()
const routerPosts = express.Router()
const routerLesson = express.Router()
passportLocal.use(new LocalStrategy(
    function (username, password, done) {
        user.findOne({ username, password })
            .then(data => {
                if (data) return done(null, data)
                return done(null, false)
            }).catch(err => done(err))
    }
))

passportLocal.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

passportLocal.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
})
passportFacebook.use(new FacebookStrategy({
    clientID: "763249841771031",
    clientSecret: "ca5f90d84d228f5dfd69f470ec5e2dc5",
    callbackURL: "https://adad-113-161-210-139.ap.ngrok.io/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile)
    }
))

passportFacebook.serializeUser(function (user, cb) {
    process.nextTick(function () {
        console.log("test successfulsss")
        return cb(null, user);
    });
});

passportFacebook.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        console.log("test successful")
        return cb(null, user);
    });
});

const initWebApp = function (app) {
    router.get('/', controllers.checkLogin, controllers.getHomePage)
    router.post('/login',
        passportLocal.authenticate('local', { failureRedirect: '/' }), controllers.passPortAuthenLocal, controllers.getHomePage)
    router.get('/login', controllers.getLoginPage)
    router.get('/auth/facebook', passportFacebook.authenticate('facebook'))
    router.get('/auth/facebook/callback', passportFacebook.authenticate('facebook', { failureRedirect: '/' }), controllers.passPortAuthenFacebook, controllers.getHomePage)
    router.get('/logout', controllers.logout, controllers.checkLogin, controllers.getHomePage)
    router.get('/mycourses', controllers.checkLogin, controllers.getMyCourses)
    app.use('/', router)
}
const posts = function (app) {
    routerPosts.get('/showControll', controllers.checkLogin, controllers.getControllerPages)
    routerPosts.get('/updatePosts/:id', controllers.checkLogin, controllers.getPage)
    routerPosts.get('/:id', controllers.checkLogin, controllers.getPost)
    routerPosts.get('/', controllers.checkLogin, controllers.getCreatePages)
    routerPosts.get('/:id/lesson', controllers.checkLogin, controllers.getAddLessonPage)
    routerPosts.post('/:id/lesson', controllers.addLesson)
    routerPosts.post('/create', controllers.create)
    routerPosts.put('/:id', controllers.update)
    routerPosts.delete('/:id', controllers.deletePost)
    app.use('/posts', controllers.checkLogin, routerPosts)
}

const lessonRouter = function (app) {
    routerLesson.get('/:id/updatePage', controllers.checkLogin, controllers.getUpdateLessonPage)
    routerLesson.get('/:user/:id', controllers.checkLogin, controllers.getLessonsPage)
    routerLesson.put('/:id', controllers.updateLesson)
    routerLesson.delete('/:id', controllers.deleteLesson)
    app.use('/lesson', routerLesson)
}

export default {
    initWebApp, posts, lessonRouter
}