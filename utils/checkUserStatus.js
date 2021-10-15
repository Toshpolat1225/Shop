const User = require('../models/User')
module.exports = async function(phoneNumber){
    let user = await User.findOne({telephone:phoneNumber})
        if(user&&user.blocked){
            return false
        }else{
            if(!user){
                user = new User({
                    telephone:phoneNumber
                })
                await user.save()
            }
            return true
        }
}