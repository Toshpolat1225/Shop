const Product = require('../models/Product')
module.exports = function (cart) {
    return new Promise(async (resolve, reject) => {
        try {
            let ids = []
            for (const id in cart) {
                ids.push(id)
            }
            let products = await Product.find().select('name cost imageSrc').where('_id').in(ids).exec();
            let fullCartInfo = {
                list: [],
                quantityProducts: 0,
                totalCost: 0
            }
            for (const product of products) {
                const { name, cost, imageSrc, _id } = product
                const count = parseInt(cart[product._id])
                const sum = product.cost * count
                fullCartInfo.totalCost += sum
                fullCartInfo.quantityProducts++
                fullCartInfo.list.push({ _id, name, cost, imageSrc, sum, count })
            }
            resolve(fullCartInfo)
        } catch (error) {
            console.log(error);
            reject(error)
        }

    })
}