const userModel = require('../../models/users')
const cartModel = require('../../models/cart')
const resetLinkModel = require('../../models/resetLink')
const userVerificationModel = require('../../models/userVerification')
const JWT = require('jsonwebtoken');
const { handleSendResetMessage } = require('../../functions/telegramBot');
const subscriptions = require('../../models/subscriptions');

const createToken =  (_id)=>{
    return JWT.sign({_id},process.env.SECRET,{expiresIn:'90d'})
}

const createUser = async (req,res) => {
    const { userName,phoneNumber,password } = req.body

    try {
        const { _id,isVerified } = await userModel.createUser(userName,phoneNumber,password);
        const { code } = await userVerificationModel.createCode(_id);
        const token = createToken(_id);
        res.status(200).json({
            userName,
            phoneNumber,
            isVerified,
            token,
            code
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const userLogin = async (req,res) => {
    const { phoneNumber,password } = req.body

    try {
        const {_id,userName,isVerified } = await userModel.login(phoneNumber,password)
        const cartItems = await cartModel.getUserCartItems(_id)
        const token = createToken(_id)

        if(isVerified){
            res.status(200).json({
                userName,
                phoneNumber,
                isVerified,
                token,
                cartItems,
                code:''
            })
        }else {
            const { code } = await userVerificationModel.getUserCode(_id)
            res.status(200).json({
                userName,
                phoneNumber,
                isVerified,
                token,
                cartItems,
                code
            })
        }
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const sendResetPassLink = async (req,res) => {
    const {phoneNumber} = req.body
    try {
        const user = await userModel.sendResetPass(phoneNumber)
        const link = await resetLinkModel.createLink(user._id)
        await handleSendResetMessage(user.telegramChatId,link._id)

        res.status(200).json({
            message:'تم إرسال الرابط الى اليليجرام بنجاح'
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const resetPass = async (req,res) => {
    const {_id,newPassword} = req.body

    try {
        const link = await resetLinkModel.findOneAndDelete({_id})
        const user = await userModel.changePassword(link.userId,newPassword)

        res.status(200).json({
            message:'تمت إعادة تعيين الرمز بنجاح'
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getUserData = async (req,res) => {
    const { _id,userName,phoneNumber,isVerified } = req.user

    try {
        const cartItems = await cartModel.getUserCartItems(_id)
        if(isVerified){
            const subs = await subscriptions.getUserSubs(_id)
            res.status(200).json({userName,phoneNumber,isVerified,cartItems,code:'',subs})
        }else {
            const { code } = await userVerificationModel.getUserCode(_id)
            res.status(200).json({userName,phoneNumber,isVerified,cartItems,code})
        }
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const isUserVerified = async (req,res) => {
    const { isVerified } = req.user

    res.status(200).json({isVerified})
}

module.exports = {
    createUser,
    userLogin,
    sendResetPassLink,
    resetPass,
    getUserData,
    isUserVerified
}