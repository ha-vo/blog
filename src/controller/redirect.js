import model from '../model/device.js'

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

export default {
    getHomePage,
    getCreatePages,
    create,
    getControllerPages,
    getPage,
    update,
    deletePost,
    getPost
}