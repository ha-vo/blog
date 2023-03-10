import model from '../model/device.js'

const getHomePage = (req, res, next) => {
    model.find({})
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

export default {
    getHomePage,
    getCreatePages,
    create,
    getControllerPages
}