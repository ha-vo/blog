import model from '../model/device.js'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import fs from 'fs'
import * as dotenv from 'dotenv'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import user from '../model/user.js'
import { request } from 'http'
import lesson from '../model/lesson.js'

dotenv.config()
const dir = process.env.parentDir

const getLoginPage = (req, res, next) => {
    res.render('login')
}
const getHomePage = async (req, res, next) => {
    let id = req.query.id
    if (!id) id = 1
    let limitPage = 3
    let login = req.login
    let user1 = req.username
    model.find({}).skip((id - 1) * limitPage).limit(limitPage)
        .then(devices => {
            res.render('home', { devices, login, user1 })
        })
        .catch(next)
}

const getCreatePages = (req, res, next) => {
    let login = req.login
    let user1 = req.username
    model.find({})
        .then(devices => {
            res.render('create', { login, user1 })
        })
        .catch(next)
}

const create = (req, res, next) => {
    req.body.img = `https://img.youtube.com/vi/${req.body.img}/sddefault.jpg`
    model.create(req.body)
        .then(() => {
            res.redirect('/')
        })
        .catch(next)
}

const getControllerPages = (req, res, next) => {
    let login = req.login
    let user1 = req.username
    model.find({})
        .then(devices => {
            res.render('controller', { devices, login, user1 })
        })
        .catch(next)
}

const getPage = (req, res, next) => {
    let login = req.login
    let user1 = req.username
    model.findById(req.params.id)
        .then(device => {
            res.render('page', { device, login, user1 })
        })
        .catch(next)
}

const update = (req, res, next) => {
    model.updateOne({ _id: req.params.id }, req.body)
        .then(() => {
            res.redirect('/')
        })
        .catch(next)
}

const deletePost = (req, res, next) => {
    model.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect('back')
        })
        .catch(next)
}

const getPost = (req, res, next) => {
    let id = req.params.id
    let login = req.login
    let user1 = req.username
    lesson.find({ courseID: req.params.id })
        .then((data) => {
            model.findById(req.params.id)
                .then(device => {
                    res.render('detailCourse', { device, login, user1, data, id })
                })
                .catch(next)
        }).catch((err) => res.send(err))

}


const checkLogin = (req, res, next) => {
    if (req.headers.cookie) {
        let token = cookie.parse(req.headers.cookie).token
        if (token) {
            let publicKey = fs.readFileSync(dir + '/key/public.crt')
            jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
                if (err) {
                    req.login = 0
                    next()
                } else {
                    req.login = 1
                    req.username = String(decoded.name)
                    next()
                }
            })
        } else {
            res.status(400).json('Bạn Cần Đăng Nhập Lại')
        }
    } else {
        req.login = 0
        next()
    }
}
passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log(username, password)
        user.findOne({ username, password })
            .then(data => {
                if (data) return done(null, data)
                return done(null, false)
            }).catch(err => done(err))
    }
))
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            username: user.username,
            password: user.password
        });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

const passPortAuthenLocal = function (req, res, next) {
    let user1 = req.session.passport.user
    let privateKey = fs.readFileSync(dir + '/key/private.pem')
    let name = user1.username
    console.log(name)
    jwt.sign({ name }, privateKey, { algorithm: 'RS256' }, function (err, token) {
        if (!err) {
            res.cookie('token', token)

            req.login = 1
            req.username = user1
            res.redirect('/')
        } else {
            res.status(400).json('err')
        }
    })
}

const passPortAuthenFacebook = (req, res, next) => {
    let user1 = req.user
    console.log(user1)
    let privateKey = fs.readFileSync(dir + '/key/private.pem')
    jwt.sign(`${req.user.displayName}`, privateKey, { algorithm: 'RS256' }, function (err, token) {
        if (!err) {
            res.cookie('token', token)
            user.findOne({ id: req.user.id })
                .then(() => {
                    console.log("Đã tìm thấy")
                    next()
                })
                .catch(() => {
                    console.log("done")
                    user.create({
                        id: String(req.user.id),
                        username: req.user.displayName.username
                    })
                    next()
                })
        } else {
            res.status(400).json('err')
        }
    })
}

const getLessonPage = (req, res, next) => {
    let id = req.params.id
    let user1 = req.username
    let login = req.login
    res.render('addLesson', { user1, login, id })
}

const addLesson = (req, res, next) => {
    lesson.create(req.body)
        .then(() => res.redirect('back'))
        .catch(err => res.send(err))
}

const getLessonsPage = (req, res, next) => {
    let index = req.params.index
    if (!index) index = 1
    let login = req.login
    let id = req.params.id
    let user1 = req.params.user
    user.updateOne({ filter: { username: user1 }, update: { courseID: id } })
        .then(() => {
            lesson.find({ courseID: id })
                .then((data) => {
                    console.log(data)
                    res.render('lessons', { id, user1, data, login, index })
                })
        })
        .catch((err) => { response.send(err) })
}
export default {
    getHomePage, getCreatePages, create,
    getControllerPages, getPage,
    update, deletePost, getPost, getLoginPage, checkLogin,
    passPortAuthenLocal, passPortAuthenFacebook, getLessonPage, addLesson,
    getLessonsPage

}