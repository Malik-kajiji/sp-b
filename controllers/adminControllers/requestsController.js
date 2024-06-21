const requestModel = require('../../models/requests')
const userModel = require('../../models/users')
const subscriptionModel = require('../../models/subscriptions')
const profitsModel = require('../../models/profits')
const { handleAddUser,handleSendMessage,handleSendRenewMessage } = require('../../functions/telegramBot')

const getPendingOrders = async (req,res) => {
    try {
        const pendingOrders = await requestModel.getPendingOrders()

        res.status(200).json({pendingOrders})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const acceptOrder = async (req,res) => {
    const { _id } = req.body
    try {
        const order = await requestModel.acceptOrder(_id)

        const { telegramChatId,userName,phoneNumber,userTelegramId,userTelegramUsername } = await userModel.findOne({_id:order.userId})
        for(let i = 0; i<order.groupsIds.length;i++){
            const { groupChatIds,groupId,name,periodInDays,isLifeTime,groupImageUrl } = order.groupsIds[i]
            const doesSubExists = await subscriptionModel.findOne({userId:order.userId,groupId:groupId,isEnded:false})
            if(doesSubExists){
                const { endDate } = await subscriptionModel.renewSubscription(doesSubExists._id,parseInt(periodInDays))
                await handleSendRenewMessage(telegramChatId,name,new Date(endDate).toLocaleDateString())
            }else {
                const {_id,endDate} = await subscriptionModel.createSubscription(order.userId,userName,phoneNumber,groupChatIds,groupId,name,parseInt(periodInDays),userTelegramId,telegramChatId,isLifeTime,groupImageUrl)
                await handleAddUser(telegramChatId,groupChatIds,userTelegramId,userTelegramUsername,name,new Date(endDate).toLocaleDateString(),phoneNumber)
            }
        }
        await profitsModel.increaseProfits(order.totalPrice,order.groupsIds.length)

        res.status(200).json({order})
    }catch(err){
        console.log(err.message)
        res.status(400).json({message:err.message})
    }
}

const rejectOrder = async (req,res) => {
    const { _id } = req.body
    try {
        const order = await requestModel.rejectOrder(_id)
        const { telegramChatId } = await userModel.findOne({_id:order.userId})
        await handleSendMessage(telegramChatId,'لقد تم رفض طلبك لعدم سداد القيمة في حال تأكدك من تسديدها الرجاء التواصل على رقم الواتسآب الآتي: \n 218-911971731')

        res.status(200).json({order})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const notCompletedPayment = async (req,res) => {
    const { _id,paid } = req.body
    try {
        const order = await requestModel.notPaidOrder(_id,paid)
        const { telegramChatId } = await userModel.findOne({_id:order.userId})
        await handleSendMessage(telegramChatId,
            `لم تدفع قيمة طلبك كاملة! \n لمزيد من التفاصيل قم بزيارة الرابط الآتي:`
        )
        await handleSendMessage(telegramChatId,
            `${process.env.FRONT_END_URL}/complete-payment/${_id}`
        )
        res.status(200).json({order})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    getPendingOrders,
    acceptOrder,
    rejectOrder,
    notCompletedPayment
}