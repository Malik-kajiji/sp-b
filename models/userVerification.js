const mongoose = require('mongoose');
const crypto = require('crypto');

const schema = mongoose.Schema

const userVerificationSchema = new schema({
    userId: {
        type:String,
        required:true
    },
    code: {
        type:String,
        required:true
    }
},{timestamps:true})

userVerificationSchema.statics.createCode = async function(userId) {
    const code = crypto.randomBytes(12).toString('hex')
    const newVerification = await this.create({userId,code})

    return newVerification
}

userVerificationSchema.statics.getUserCode = async function(userId) {
    const newVerification = await this.findOne({userId})

    return newVerification
}

userVerificationSchema.statics.getUserIdByCode = async function(code) {
    const docData = await this.findOne({code})
    if(!docData){
        throw Error('الرمز غير موجود!')
    }

    return docData
}

userVerificationSchema.statics.deleteCodes = async function(userId) {
    const deletedVerifications = await this.deleteMany({userId})

    return deletedVerifications
}

module.exports = mongoose.model('userVerification',userVerificationSchema)