const TelegramBot = require('node-telegram-bot-api');
const userVerification = require('../models/userVerification');
const users = require('../models/users');
const subscriptionModel = require('../models/subscriptions')
const resetLinkModel = require('../models/resetLink')
const adminTeleModel = require('../models/teleAdmin')
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});


const telegramBot = () => {
    bot.onText(/\/start/, (msg) => {
        if(msg.chat.type === 'private'){
            const chatId = msg.chat.id;
            const responseMessage = `مرحبا بك في عالم سبيس تيك!
            الرجاء توثيق حسابك عن طريق إدخال:
            /link رمز-التوثيق`;
        
            bot.sendMessage(chatId, responseMessage);
        }
    });
    bot.onText(/\/link (.+)/, async (msg, match) => {
        if(msg.chat.type === 'private'){
            const chatId = msg.chat.id;
            const userTelegramId = msg.from.id;
            const userTelegramUsername = msg.from.username || `${msg.from.first_name}_${msg.from.last_name}`;
            const code = match[1];
            
            await handleLinkAccount(chatId, code, userTelegramId,userTelegramUsername);
        }
    });
    bot.onText(/\/h/, async (msg) => {
        if(msg.chat.type === 'private') {
            const chatId = msg.chat.id;
            const exists = await users.getUserByTelegramId(chatId)
            if(!exists){
                const responseMessage = `الرجاء توثيق حسابك عن طريق إدخال:\n/link رمز-التوثيق`;
                bot.sendMessage(chatId, responseMessage);
                return
            }
    
            bot.sendMessage(chatId, `
                الأوامر:
                لعرض الاشتراكات الحالية: /subs
                لعرض معلومات الحساب: /info
                لتغيير الرمز: /reset
                لتغيير رقم الهاتف: /number
            `);
        }
    });
    bot.onText(/\/subs/, async (msg) => {
        if(msg.chat.type === 'private') {
            const chatId = msg.chat.id;
            const exists = await users.getUserByTelegramId(chatId)
            if(!exists){
                const responseMessage = `الرجاء توثيق حسابك عن طريق إدخال:\n/link رمز-التوثيق`;
                bot.sendMessage(chatId, responseMessage);
                return
            }
    
            const userSubs = await subscriptionModel.find({userChatId:chatId,isEnded:false})
            if(userSubs.length === 0) {
                bot.sendMessage(chatId, `لا توجد أي اشتراكات حاليا`);
            }else {
                let result = ''
                userSubs.forEach(e => {
                    result += `${e.groupName} --- ${new Date(e.endDate).toLocaleDateString()} \n`
                })
        
                bot.sendMessage(chatId, `القنوات الحالية: \n ${result}`);
            }
        }
    });
    bot.onText(/\/info/, async (msg) => {
        if(msg.chat.type === 'private') {
            const chatId = msg.chat.id;
            const exists = await users.getUserByTelegramId(chatId)
            if(!exists){
                const responseMessage = `الرجاء توثيق حسابك عن طريق إدخال:\n/link رمز-التوثيق`;
                bot.sendMessage(chatId, responseMessage);
                return
            }
    
            const user = await users.findOne({telegramChatId:chatId})
            const response = `
                الاسم:${user.userName}
                رقم الهاتف:${user.phoneNumber}
                تاريخ الإنضمام:${new Date(user.createdAt).toLocaleDateString()}
                للاستفسار عن الأوامر قم بادخال:
                /h
            `
            bot.sendMessage(chatId, response);
        }
    });
    bot.onText(/\/reset/, async (msg,match) => {
        if(msg.chat.type === 'private') {
            const chatId = msg.chat.id;
            const exists = await users.getUserByTelegramId(chatId)
            if(!exists){
                const responseMessage = `الرجاء توثيق حسابك عن طريق إدخال:\n/link رمز-التوثيق`;
                bot.sendMessage(chatId, responseMessage);
                return
            }
    
            const user = await users.findOne({telegramChatId:chatId})
            const link = await resetLinkModel.createLink(user._id)
            await handleSendResetMessage(user.telegramChatId,link._id)
        }
    });
    bot.onText(/\/number/, async (msg,match) => {
        if(msg.chat.type === 'private') {
            const chatId = msg.chat.id;
            const exists = await users.getUserByTelegramId(chatId)
            if(!exists){
                const responseMessage = `الرجاء توثيق حسابك عن طريق إدخال:\n/link رمز-التوثيق`;
                bot.sendMessage(chatId, responseMessage);
                return
            }
    
            const newPhoneNumber = match[1];
            if(newPhoneNumber.length < 8){
                bot.sendMessage(chatId, `الرجاء إدخال رقم صالح`);
            }else {
                try {
                    const newUser = await users.updatePhoneNumber(chatId,newPhoneNumber)
                    const responseMessage = `تم تغيير الرقم بنجاح!
                    الاسم:${newUser.userName}
                    رقم الهاتف:${newUser.phoneNumber}
                    تاريخ الإنضمام:${new Date(newUser.createdAt).toLocaleDateString()}
                    `
                    bot.sendMessage(chatId, responseMessage);
                }catch(err){
                    bot.sendMessage(chatId, err.message);
                }
            }
        }
    });
    bot.onText(/\/show/, async (msg) => {
        if(msg.chat.type === 'private') {
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, `${chatId}`);
        }
    });
    bot.on('message', async (message) => {
        if(message.chat.type === 'private') {
            if(message.text.startsWith('/start') || 
                message.text.startsWith('/link') ||
                message.text.startsWith('/h') ||
                message.text.startsWith('/subs') ||
                message.text.startsWith('/info') ||
                message.text.startsWith('/reset')||
                message.text.startsWith('/number')||
                message.text.startsWith('/show')
            ) return 
    
            const exists = await users.getUserByTelegramId(message.chat.id)
            const chatId = message.chat.id;
    
            if(!exists){
                const responseMessage = `الرجاء توثيق حسابك عن طريق إدخال:\n/link رمز-التوثيق`;
                bot.sendMessage(chatId, responseMessage);
            }else {
                
            }
        }
    });
    bot.on('new_chat_members', async (message) => {
        const chatId = message.chat.id;
        const { id,is_bot } = message.new_chat_members[0];
        if(!is_bot){
            const isUserSubscribed = await subscriptionModel.findOne({groupChatId:chatId,userTelegramId:id,isEnded:false})
            if(!isUserSubscribed){
                await bot.banChatMember(chatId,id)
            }
        }
    })
}

const handleLinkAccount = async (chatId,code,userTelegramId,userTelegramUsername) => {
    try {
        const exists = await userVerification.getUserIdByCode(code)
        if(!exists){
            throw Error('رمز التوثيق غير صحيح!')
        }else {
            const user = await users.verifyUser(exists.userId,chatId,userTelegramId,userTelegramUsername)
            await userVerification.deleteCodes(exists.userId)
            bot.sendMessage(chatId,
                `تم التوثيق بنجاح!
                الاسم:${user.userName}
                رقم الهاتف:${user.phoneNumber}
                تاريخ الإنضمام:${new Date(user.createdAt).toLocaleDateString()}
                للاستفسار عن الأوامر قم بادخال:
                /h
                `
            )
        }
    }catch(err){
        bot.sendMessage(chatId,err.message)
    }
}

const handleSendResetMessage = async (chatId,code) => {
    bot.sendMessage(chatId,
        `رابط تجديد كلمة المرور الخاصة بك هو:\n${process.env.FRONT_END_URL}/reset/${code}`
    )
}

const handleSendRenewMessage = async (chatId,groupName,expireDate) => {
    const message = `مرحبا بك! لقد قمت بتمديد الاشتراك في القناة بنجاح\n ${groupName} \n تاريخ انتهاء الصلاحية ${expireDate}`;

    bot.sendMessage(chatId, message);
}

const handleAddUser = async (chatId, groupChatIds, userTelegramId,userTelegramUsername,groupName,expireDate,phoneNumber) => {
    for(let i = 0; i<groupChatIds.length;i++){
        const chatType = (await bot.getChat(groupChatIds[i])).type;
        try {
            if(chatType === 'channel'){
                const adminTele = await adminTeleModel.getTeleAdmin()
                await bot.sendMessage(adminTele.userTelegramChatId, `الرجاء إضافة المستخدم الآتي إلى قناة ${groupName} \n ${userTelegramUsername} \n ${phoneNumber}`);
    
            }else {
                const member = await bot.getChatMember(groupChatIds[i], userTelegramId);
    
                if (member && member.status === 'member') {
                    throw Error('المستخدم مشترك بالفعل')
                }else {
                    await bot.unbanChatMember(groupChatIds[i],userTelegramId)
                    const inviteLink = await bot.exportChatInviteLink(groupChatIds[i]);
                    const message = `${inviteLink}`;
    
                    bot.sendMessage(chatId, message);
                }
            }
        } catch (error) {
            bot.sendMessage(chatId, `فشل في اضافتك في القناة: \n ${groupName} \n الرجاء التواصل مع رقم الواتس آب الآتي: \n 218-911971731`);
        }
    }
    const message = `مرحبا بك! لقد قمت بالاشتراك في القناة بنجاح\n ${groupName} \n تاريخ انتهاء الصلاحية ${expireDate}`;
    await bot.sendMessage(chatId, message);
};

const removeMemberWithMessageById = async (groupChatIds,userTelegramId,telegramChatId,channelName) => {
    for(let i = 0;i<groupChatIds.length;i++){
        await bot.banChatMember(chatId,userTelegramId)
    }
    bot.sendMessage(telegramChatId,`لقد انتهى اشتراكك في باقة ${channelName}`)
}

const remaindMemberWithMessageById = async (telegramChatId,channelName,leftDays) => {
    bot.sendMessage(telegramChatId,`تبقى ${leftDays} أيام على انتهاء اشتراكك في باقة ${channelName}`)
}

const handleSendMessage = async (chatId,message) => {
    try {
        await bot.sendMessage(chatId, message);
    } catch (error) {
        console.error(error);
    }
};

const bannedMemberWithMessageById = async (groupChatIds,userTelegramId,telegramChatId,channelName) => {
    for(let i = 0;i<groupChatIds.length;i++){
        await bot.banChatMember(groupChatIds[i],userTelegramId)
    }

    bot.sendMessage(telegramChatId,`لقد تم حظرك من قناة ${channelName}`)
}

const orderNotification = async () => {
    await bot.sendMessage(process.env.OWNER_CHAT_ID, `هنالك طلب جديد في لوحة التحكم!`);
}


module.exports = {
    telegramBot,
    handleSendResetMessage,
    handleAddUser,
    removeMemberWithMessageById,
    remaindMemberWithMessageById,
    handleSendMessage,
    bannedMemberWithMessageById,
    handleSendRenewMessage,
    orderNotification
}