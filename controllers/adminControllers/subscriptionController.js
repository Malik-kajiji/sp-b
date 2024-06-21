const subscriptionModel = require('../../models/subscriptions');
const { bannedMemberWithMessageById } = require('../../functions/telegramBot')

const getCurrentSubs = async (req,res) => {
    const { page_count } = req.params;
    try {
        const subs = await subscriptionModel.getCurrentSubscriptions(page_count);

        res.status(200).json({subs})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getSubsForUser = async (req,res) => {
    const { phone_number } = req.params;
    try {
        const subs = await subscriptionModel.getUserSubscriptions(phone_number);

        res.status(200).json({subs})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const endSub = async (req,res) => {
    const { _id } = req.body;
    try {
        const sub = await subscriptionModel.endSubscription(_id);
        const { groupChatIds,userTelegramId,userChatId,groupName } = sub
        await bannedMemberWithMessageById(groupChatIds,userTelegramId,userChatId,groupName)

        res.status(200).json({sub})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    getCurrentSubs,
    getSubsForUser,
    endSub
}