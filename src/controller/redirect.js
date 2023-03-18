import model from '../model/device.js'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import fs from 'fs'
import * as dotenv from 'dotenv'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import user from '../model/user.js'
import { request } from 'http'

dotenv.config()
const dir = process.env.parentDir

const getLoginPage = (req, res, next) => {
    res.render('login')
}
const getHomePage = (req, res, next) => {
    let id = req.query.id
    if (!id) id = 1
    let limitPage = 3
    model.find({}).skip((id - 1) * limitPage).limit(limitPage)
        .then(devices => {
            res.render('home', { devices })
        })
        .catch(next)
}

const getCreatePages = (req, res, next) => {
    model.find({})
        .then(devices => {
            res.render('create')
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

    model.find({})
        .then(devices => {
            res.render('controller', { devices })
        })
        .catch(next)
}

const getPage = (req, res, next) => {
    model.findById(req.params.id)
        .then(device => {
            res.render('page', { device })
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
    model.findById(req.params.id)
        .then(device => {
            res.render('post', { device })
        })
        .catch(next)
}


const checkLogin = (req, res, next) => {
    let token = cookie.parse(req.headers.cookie).token
    if (token) {
        let publicKey = fs.readFileSync(dir + '/key/public.crt')
        jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                res.status(400).json('Bạn Cần Đăng Nhập Lại')
            } else {
                next()
            }
        })
    } else {
        res.status(400).json('Bạn Cần Đăng Nhập Lại')
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
    let user = req.session.passport.user
    let privateKey = fs.readFileSync(dir + '/key/private.pem')
    let name = user.username
    console.log(req.session)
    jwt.sign({ name }, privateKey, { algorithm: 'RS256' }, function (err, token) {
        if (!err) {
            res.cookie('token', token)
            next()
        } else {
            res.status(400).json('err')
        }
    })
}

const passPortAuthenFacebook = (req, res, next) => {
    let user = req.session.passport.user
    let privateKey = fs.readFileSync(dir + '/key/private.pem')
    jwt.sign(`${req.user.id}`, privateKey, { algorithm: 'RS256' }, function (err, token) {
        if (!err) {
            res.cookie('token', token)
            user.findOne({ username: req.user.displayName })
                .catch(() => {
                    user.create({ username: req.user.displayName, _id: req.user.id })
                    next()
                })
        } else {
            res.status(400).json('err')
        }
    })
}
export default {
    getHomePage, getCreatePages, create,
    getControllerPages, getPage,
    update, deletePost, getPost, getLoginPage, checkLogin,
    passPortAuthenLocal, passPortAuthenFacebook
}