import model from '../model/device.js'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import passport from 'passport'
import LocalStrategy from 'passport-local'



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

const addCookie = (req, res, next) => {
    let username = req.body.username
    model.findOne({ username })
        .then(() => {
            let token = jwt.sign({ username }, "1234")
            res.cookie('token', token)
            next()
        })
        .catch((err) => next(err))

}
const checkLogin = (req, res, next) => {
    let token = cookie.parse(req.headers.cookie).token
    if (token) {
        jwt.verify(token, "1234", (err, decoded) => {
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
        model.findOne({ username, password })
            .then(data => {
                if (data) done(null, data)
                done(null, false)
            }).catch(err => done(err))
    }
));

const passPortAuthen = (req, res, next) => {
    passport.authenticate('local', function (err, user) {
        if (err) return res.status(500).json('Loi server')
        if (!user) return res.status(404).json("Tên đăng nhập và mật khẩu sai")
        req.user = user.username
        req.pass = user.password
        req.logIn(user, function (err) {
            if (err) return next(err)
            let token = jwt.sign(user.toOject(),)
        })
    })
}

export default {
    getHomePage, getCreatePages, create,
    getControllerPages, getPage,
    update, deletePost, getPost, addCookie, getLoginPage, checkLogin,
    passPortAuthen
}