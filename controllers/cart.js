const getCart = require('../utils/getCart')
const getFullCartInfo = require('../utils/getFullCartInfo')
const User = require('../models/User')
module.exports.add = async (req, res) => {
    try {
        let user = await User.findById(req.session.user._id)
        user.addToCart(req.body.productId, +req.body.count)
        user = await user.populate('cart.list.productId').execPopulate()
        const cart = getCart(user.cart)
        res.status(200).json({
            countProducts: cart.countProducts,
            totalCost: cart.totalCost
        })
    } catch (e) {
        console.log(e);
    }
}

module.exports.getFullCartInfo = async (req, res) => {
    const {cart} = req.body
    const fullCartInfo = await getFullCartInfo(cart)
    res.status(200).json(fullCartInfo)
}

module.exports.getAll = async (req, res) => {
    try {
        
        res.render('cart', {
            layout: 'cart',
            cartError: req.flash('cartError'),
            title: 'Корзина'
        })
    } catch (e) {
        console.log(e);
    }
}

module.exports.remove = async (req, res) => {
    try {
        let user = await User.findById(req.session.user._id)
        await user.deleteProduct(req.params.productId)
        user = await user.populate('cart.list.productId').execPopulate()
        const cart = getCart(user.cart)
        res.json(cart)
    } catch (e) {
        console.log(e);
    }
}

module.exports.update = async (req, res) => {
    try {
        let user = await User.findById(req.session.user._id)
        await user.updateCart(req.body.productId, +req.body.count)
        user = await user.populate('cart.list.productId').execPopulate()
        const cart = getCart(user.cart)
        res.json(cart)
    } catch (e) {
        console.log(e);
    }
}