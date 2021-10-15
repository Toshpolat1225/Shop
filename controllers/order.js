const Order = require('../models/Order')
const getFullCartInfo = require('../utils/getFullCartInfo')
const getListForOrder = require('../utils/getListForOrder')
const getPaginateForFrontend = require('../utils/getPaginateForFrontend')
const checkUserStatus = require('../utils/checkUserStatus')
const moment = require('moment')
const DeliveryCost = require('../models/DeliveryCost')
const Drivers = require('../models/Drivers')

module.exports.getOrderDetailsPage = function (req, res) {
    const date = new Date()
    let deliveryTime = []
    const hours = date.getHours()
    for (let i = 8; i <= 20; i += 2) {
        if (i > hours && i <= 20) {
            const time = {
                timeId: i,
                timeInterval: i < 10 ? `0${i}:00 - ${i + 2}:00` : `${i}:00 - ${i + 2}:00`
            }
            deliveryTime.push(time)
        } else if (hours >= 20) {
            const time = {
                timeId: i,
                timeInterval: i < 10 ? `0${i}:00 - ${i + 2}:00 Завтра` : `${i}:00 - ${i + 2}:00 Завтра`
            }
            deliveryTime.push(time)
        }
    }
    res.render('orderDetails', {
        title: 'Оформление заказа',
        deliveryTime
    })
}

module.exports.getAll = async function (req, res) {
    let query = { user: req.session.user._id }
    try {
        let perPage = 5
        let page = req.query.page || 1
        const options = {
            page,
            sort: { date: -1 },
            limit: perPage,
            collation: {
                locale: 'en'
            },
            populate: {
                path: 'user',
                select: 'telephone'
            },
            lean: true,
        };
        let orders = await Order.paginate(query, options)
        const paginate = getPaginateForFrontend(orders)
        res.render('orders', {
            orders: orders.docs,
            paginate,
            title: 'Заказы'
        })

    } catch (error) {
        console.log(error);
    }
}

module.exports.create = async function (req, res) {
    try {
        const { phoneNumber, name, street, homeNumber, deliveryTime, cart } = req.body
        const result = await checkUserStatus(phoneNumber)
        if (result) {
            const orders = await Order.find().sort({ date: -1 })
            const maxOrder = orders.length > 0 ? orders[0].order : 0
            const deliveryCost = await DeliveryCost.findOne()
            const fullCartInfo = await getFullCartInfo(cart)
            const orderTotalCost = fullCartInfo.totalCost + deliveryCost.cost
            if (fullCartInfo.quantityProducts > 0) {
                const list = getListForOrder(fullCartInfo.list)
                const order = new Order({
                    order: maxOrder + 1,
                    list,
                    cartTotalCost: fullCartInfo.totalCost,
                    deliveryCost: deliveryCost.cost,
                    orderTotalCost,
                    deliveryTimeId: deliveryTime.timeId,
                    deliveryTimeInterval: deliveryTime.timeInterval,
                    adress: {
                        latitude: req.body.latitude,
                        longitude: req.body.longitude,
                        street: street,
                        homeNumber: homeNumber
                    },
                    user: {
                        name,
                        phoneNumber
                    }
                })
                await order.save()
                res.status(201).json(order)
            } else {
                res.status(204)
            }
        } else {
            // если пользователь заблокирован
            res.json({ status: 403 })
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports.setWrappedAndDeliveredState = async function (req, res) {
    try {
        const { order, isWrapped, isDelivered } = req.body
        if (isWrapped !== undefined) {
            const updated = {
                isWrapped: isWrapped
            }
            await Order.findOneAndUpdate(
                { order: +order },
                { $set: updated },
                { new: true }
            )
            res.status(200).json({
                message: 'success'
            })
        }

        if (isDelivered !== undefined) {
            const updated = {
                isDelivered: isDelivered
            }
            await Order.findOneAndUpdate(
                { order: +order },
                { $set: updated },
                { new: true }
            )
            res.status(200).json({
                message: 'success'
            })
        }
    } catch (error) {
        res.json({
            message: 'error'
        })
        console.log(error);
    }
}

module.exports.showOrdersOnMap = async function (req, res) {
    let { timeId } = req.query
    let responseObject = {
        title: 'Все заказы'
    }
    if (timeId) {
        responseObject.timeId = timeId
        const timeIntervalStart = timeId
        const timeIntervalEnd = parseInt(timeId) + 2
        responseObject.title = `${timeIntervalStart}:00-${timeIntervalEnd}:00`
    }
    res.render('admin/ordersOnMap', {
        layout: 'map',
        ...responseObject
    })
}
module.exports.delete = async function (req, res) {
    try {
        await Order.findOneAndDelete({ order: req.params.order })
        res.json({
            message: 'deleted'
        })
    } catch (error) {
        res.json({
            message: 'don`t deleted'
        })
    }
}
module.exports.getAdress = async function (req, res) {
    try {
        const { timeId } = req.query
        let query = {
            isDelivered: false
        }
        if (timeId) {
            query.deliveryTimeId = timeId
        }
        const orders = await Order.find(query).select('adress order')
        let orderList = []
        let conditions = false
        for (let i = 0; i < orders.length; i++) {
            conditions = orders[i].adress.latitude && orders[i].adress.longitude
            if (conditions) {
                obj = {
                    //nomer zakaza
                    //adress
                    adress: orders[i].adress,
                    order: orders[i].order
                }
                orderList.push(obj)
            }
        }
        res.json({
            orderList
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports.sendLocation = async function (req, res) {
    try {
        const { orderNumber } = req.params
        const bot = require('../models/driverBot')
        let order = await Order.findOne({ order: orderNumber }).populate('user', 'name telephone')
        const drivers = await Drivers.find({ access: true })
        const lat = order.adress.latitude
        const long = order.adress.longitude
        let orderList = ''
        order.list.map((item) => {
            orderList +=
                `${item.name}, ${item.count}, ${item.sum} Сум
    `
        })
        const orderInfo =
            `*Заказ №${order.order}*
    ------------------------------------------
    ${orderList}
    *Всего* - ${order.cartTotalCost} Сум
    *Доставка* - ${order.deliveryCost} Сум
    *Итого* - ${order.orderTotalCost} Сум
    *Дата заказа* - ${moment(order.date).utcOffset(5).format('DD.MM.YYYY  HH:mm')}
    *Время доставки* - ${order.deliveryTimeInterval}
    *Клиент* - ${order.user.name}
    *Номер клиента* - ${order.user.telephone}
    `
        if (lat && long) {
            for (let i = 0; i < drivers.length; i++) {
                await bot.sendMessage(drivers[i].chatId, orderInfo, {
                    parse_mode: 'Markdown'
                })
                await bot.sendLocation(drivers[i].chatId, lat, long)
            }
        }
        res.json({
            message: 'sent'
        })
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.getOrderPage = function (req, res) {
    res.render('order', {
        title: 'Информация о заказе'
    })
}