const mongoose = require('mongoose');

const schema = mongoose.Schema

const subscriptionSchema = new schema({
    userId: {
        type:String,
        required:true
    },
    userName: {
        type:String,
        required:true
    },
    phoneNumber: {
        type:String,
        required:true
    },
    userTelegramId: {
        type:String,
        required:true
    },
    userChatId: {
        type:String,
        required:true
    },
    groupId: {
        type:String,
        required:true,
    },
    groupName: {
        type:String,
        required:true,
    },
    groupChatIds: {
        type:String,
        required:true,
    },
    startDate: {
        type:Date,
        required:true,
    },
    endDate: {
        type:Date,
    },
    remaindingDate: {
        type:Date,
    },
    isEnded: {
        type:Boolean,
        required:true,
        default:false
    },
    isAboutToEnd: {
        type:Boolean,
        required:true,
        default:false
    },
    groupImageUrl: {
        type:String,
        required:true,
        default:''
    }
})

subscriptionSchema.statics.createSubscription = async function(userId,userName,phoneNumber,groupChatIds,groupId,groupName,period,userTelegramId,userChatId,isLifeTime,groupImageUrl) {
    if(isLifeTime){
        const startDate = new Date();
        const newSubscription = await this.create({userId,userName,phoneNumber,groupChatIds,groupId,groupName,startDate,userTelegramId,userChatId,groupImageUrl})
    
        return newSubscription

    }else {
        //start date
        const startDate = new Date();
        //end data
        let endDate = new Date(startDate);
        let endDateDay = endDate.getDate();
        endDate.setDate(endDateDay + period + 1);
        // remainding date
        let remaindingDate = new Date(startDate);
        let remaindingDateDay = endDate.getDate();
        remaindingDate.setDate(remaindingDateDay + period - 5);
    
        const newSubscription = await this.create({userId,userName,phoneNumber,groupChatIds,groupId,groupName,startDate,endDate,remaindingDate,userTelegramId,userChatId,groupImageUrl})
    
        return newSubscription

    }
}

subscriptionSchema.statics.renewSubscription = async function(_id,period) {
        const sub = await this.findOne({_id})
        //start date
        const startDate = new Date(sub.endDate);
        //end data
        let endDate = new Date(startDate);
        let endDateDay = endDate.getDate();
        endDate.setDate(endDateDay + period + 1);
        // remainding date
        let remaindingDate = new Date(startDate);
        let remaindingDateDay = endDate.getDate();
        remaindingDate.setDate(remaindingDateDay + period - 5);

        
        const newSubscription = await this.findOneAndUpdate({_id},{endDate,remaindingDate,isAboutToEnd:false})
    
        return {...newSubscription._doc,endDate}
}

subscriptionSchema.statics.getCurrentSubscriptions = async function(pageCount){
    const limitCount = 50
    const skipCount = limitCount * (pageCount - 1)
    const subs = await this.find({isEnded:false})
    .limit(limitCount)
    .skip(skipCount)

    return subs
}

subscriptionSchema.statics.getUserSubscriptions = async function(phoneNumber){
    const subs = await this.find({phoneNumber});

    return subs
}

subscriptionSchema.statics.getSubscriptionsToEnd = async function(){
    const todaysDate = new Date().getDate();
    const subs = await this.find({endDate:todaysDate});

    return subs
}

subscriptionSchema.statics.endSubscription = async function(_id){
    const todaysDate = new Date().getDate()
    const endedSub = await this.findOneAndUpdate({_id},{isEnded:true,endDate:todaysDate});

    return {...endedSub._doc,isEnded:true,endDate:todaysDate}
}

subscriptionSchema.statics.endSubscriptions = async function(_id){
    const todaysDate = new Date().getDate();
    const endedSub = await this.updateMany({endDate:todaysDate},{isEnded:true});

    return {...endedSub._doc,isEnded:true,}
}

subscriptionSchema.statics.getSubscriptionsToRemaind = async function(){
    const todaysDate = new Date().getDate();
    const subs = await this.find({remaindingDate:todaysDate});

    return subs
}

subscriptionSchema.statics.remindSubscriptions = async function(){
    const todaysDate = new Date().getDate();
    const subs = await this.updateMany({remaindingDate:todaysDate},{isAboutToEnd:true});

    return subs
}

subscriptionSchema.statics.getGroupMembers = async function(groupId){
    const subs = await this.find({groupId});

    return subs
}

subscriptionSchema.statics.getUserSubs = async function(userId){
    const subs = await this.find({userId});

    return subs
}

module.exports = mongoose.model('subscription',subscriptionSchema)