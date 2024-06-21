const cron = require('node-cron');
const subModel = require('../models/subscriptions')
const {
    removeMemberWithMessageById,
    remaindMemberWithMessageById
} = require('../functions/telegramBot')

// This function will be executed every day at 11:59 PM
const remindAndRemove = async () => {
    const todaysDay = new Date().getDate()

    const subsToRemaind = await subModel.find({remaindingDate:todaysDay})
    for(let i = 0;i < subsToRemaind.length;i++){
        remaindMemberWithMessageById(subsToRemaind[i].userChatId,subsToRemaind[i].groupName,5)
        await subModel.remindSubscriptions()
    }

    const subsToEnd = await subModel.find({endDate:todaysDay})
    for(let i = 0;i < subsToEnd.length;i++){
        removeMemberWithMessageById(subsToEnd[i].groupChatIds,subsToEnd[i].userTelegramId,subsToEnd[i].userChatId)
        await subModel.endSubscriptions()
    }
};

// Schedule the task to run at 11:59 PM every day
cron.schedule('59 23 * * *', remindAndRemove);