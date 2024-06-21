const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema

const addressSchema = new schema({
    walletId: {
        type:String
    },
    qrCode: {
        type:String
    }
})

addressSchema.statics.update = async function(walletId,qrCode) {
    const exists = await this.find()
    if(exists.length === 0){
        const newAddress = await this.create({walletId,qrCode})
        return newAddress
    }else {
        const newAdmi = await this.findOneAndUpdate({_id:exists[0]._id},{walletId,qrCode})

        return {...newAdmi,walletId,qrCode}
    }
}

addressSchema.statics.getAddress = async function() {
    const Address = await this.find()
    if(Address.length > 0){
        return Address[0]
    }else {
        return null
    }
}


module.exports = mongoose.model('address',addressSchema)