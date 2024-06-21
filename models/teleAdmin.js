const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema

const teleAdminSchema = new schema({
    userTelegramChatId: {
        type:String
    }
})

teleAdminSchema.statics.update = async function(userTelegramChatId) {
    const exists = await this.find()
    if(exists.length === 0){
        const newAdmi = await this.create({userTelegramChatId})
        return newAdmi
    }else {
        const newAdmi = await this.findOneAndUpdate({_id:exists[0]._id},{userTelegramChatId})

        return {...newAdmi,userTelegramChatId}
    }
}

teleAdminSchema.statics.getTeleAdmin = async function() {
    const telegramAdmin = await this.find()
    if(telegramAdmin.length > 0){
        return telegramAdmin[0]
    }else {
        return null
    }
}


module.exports = mongoose.model('teleAdmin',teleAdminSchema)