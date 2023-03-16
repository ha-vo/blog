import model from '../model/device.js'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import fs from 'fs'
import * as dotenv from 'dotenv'

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

const addCookie = (req, res, next) => {
    let name = req.body.name
    let password = req.body.password
    model.findOne({ username: name, password })
        .then(() => {
            let privateKey = fs.readFileSync(dir + '/key/private.pem')
            let token = jwt.sign({ name }, privateKey, { algorithm: 'RS256' })
            res.cookie('token', token)
            next()
        })
        .catch((error) => res.status(400).json(error))

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


export default {
    getHomePage, getCreatePages, create,
    getControllerPages, getPage,
    update, deletePost, getPost, addCookie, getLoginPage, checkLogin
}