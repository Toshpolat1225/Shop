const mongoose = require('mongoose')
const paginate=require('mongoose-paginate-v2')
const { Schema, model } = mongoose

const userSchema = new Schema({
    name: {
        type: String
    },
    telephone: {
        type: String,
        unique: true,
        required:true
    },
    password: {
        type: String
    },
    blocked:{
        type:Boolean,
        default:false
    }
})
userSchema.plugin(paginate)
module.exports = model('User', userSchema)