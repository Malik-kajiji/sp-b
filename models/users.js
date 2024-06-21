const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const reset = require('./resetLink')

const schema = mongoose.Schema

const userSchema = new schema({
    userName: {
        type:String,
        required:true
    },
    phoneNumber: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    isVerified: {
        type:Boolean,
        default:false,
        required:true,
    },
    telegramChatId: {
        type:String,
        default:'',
    },
    userTelegramId: {
        type:String,
        default:'',
    },
    userTelegramUsername: {
        type:String,
        default:'',
    },
    isBanned: {
        type:Boolean,
        default:false,
        required:true,
    }
},{timestamps:true})

userSchema.statics.createUser = async function(userName,phoneNumber,password) {
    const exists = await this.findOne({phoneNumber})
    if(exists){
        throw Error('!الرقم مستخدم بالفعل')
    }else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt)
        const user = await this.create({userName,phoneNumber,password:hash,telegramChatId:''})
        return user
    }
}

userSchema.statics.login = async function(phoneNumber,password) {
    const exists = await this.findOne({phoneNumber})
    if(!exists){
        throw Error('الرقم غير مستخدم')
    }else {
        const match = await bcrypt.compare(password,exists.password)

        if(!match){
            throw Error('كلمة مرور غير صحيحة')
        }

        return exists
    }
}

userSchema.statics.sendResetPass = async function(phoneNumber) {
    const exists = await this.findOne({phoneNumber})
    if(!exists){
        throw Error('الرقم غير مستخدم')
    }else if(exists.telegramChatId === '') {
        throw Error('الرقم المستخدم غير موثق')
    }else {
        return exists
    }
}

userSchema.statics.changePassword = async function(_id,password) {
    const exists = await this.findOne({_id})
    if(!exists){
        throw Error('الحساب غير موجود يرجى انشاء حساب')
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);

    const updatedUser = await this.findOneAndUpdate({_id},{password:hash})

    return {...exists._doc,password:hash}
}

userSchema.statics.verifyUser = async function(_id,telegramChatId,userTelegramId,userTelegramUsername) {
    const exists = await this.findOne({_id})
    if(!exists){
        throw Error('الحساب غير موجود يرجى انشاء حساب')
    }
    const isChatIdUsed = await this.findOne({telegramChatId,userTelegramId})
    if(isChatIdUsed){
        throw Error('حساب التيليجرام مستخدم بالفعل!')
    }

    const updatedUser = await this.findOneAndUpdate({_id},{isVerified:true,telegramChatId,userTelegramId,userTelegramUsername})

    return {...exists._doc,isVerified:true,telegramChatId}
}

userSchema.statics.getUsers = async function(pageCount) {
    const limitCount = 100
    const skipCount = limitCount * (pageCount - 1)
    const users = await this.find()
    .limit(limitCount)
    .skip(skipCount)

    return users
}

userSchema.statics.getSingleUser = async function(phoneNumber) {
    const users = await this.find({phoneNumber})

    return users
}

userSchema.statics.bannedUser = async function(_id) {
    const updatedUser = await this.findOneAndUpdate({_id},{isBanned:true})

    return {...updatedUser._doc,isBanned:true}
}


userSchema.statics.unBannedUser = async function(_id) {
    const updatedUser = await this.findOneAndUpdate({_id},{isBanned:false})

    return {...updatedUser._doc,isBanned:true}
}

userSchema.statics.updatePhoneNumber = async function(telegramChatId,phoneNumber) {
    const phoneNumberUsed = await this.findOne({phoneNumber})
    if(phoneNumberUsed){
        throw Error('رقم الهاتف مستعمل بالفعل!')
    } else {
        const updatedUser = await this.findOneAndUpdate({telegramChatId},{phoneNumber})
    }

    return {...updatedUser._doc,phoneNumber}
}

userSchema.statics.getUserByTelegramId = async function(telegramChatId) {
    const user = await this.findOne({telegramChatId})

    return user
}

module.exports = mongoose.model('user',userSchema)