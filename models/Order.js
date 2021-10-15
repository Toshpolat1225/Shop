const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')
const { Schema, model } = mongoose

const orderSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    order: {
        type: Number,
        required: true
    },
    list: [
        {
            name: {
                type: String,
                required: true
            },
            cost: {
                type: Number,
                required: true
            },
            count: {
                type: Number,
                required: true
            },
            sum: {
                type: Number,
                required: true
            }
        }
    ],
    cartTotalCost: {
        type: Number,
        default: 0
    },
    deliveryCost: {
        type: Number,
        required: true
    },
    orderTotalCost: {
        type: Number,
        required: true
    },
    deliveryTimeId: {
        type: Number,
        required: true
    },
    deliveryTimeInterval: {
        type: String,
        required: true
    },
    adress: {
        latitude: {
            type: Number,
            default: 0
        },
        longitude: {
            type: Number,
            default: 0
        },
        street: {
            type:String,
            default:''
        },
        homeNumber: {
            type:String,
            default:''
        }
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    isWrapped: {
        type: Boolean,
        default: false
    },
    user: {
        name:{
            type:String
        },
        phoneNumber:{
            type:String
        }
    }
})
orderSchema.plugin(paginate)
module.exports = model('Order', orderSchema)

