const groupsModel = require('./groups');
const mongoose = require('mongoose');

const schema = mongoose.Schema

const cartSchema = new schema({
    userId: {
        type:String,
        required:true
    },
    groupId: {
        type:String,
        required:true
    },
    period: {
        type:Number,
        required:true
    }
})

cartSchema.statics.addItem = async function(userId,groupId,period) {
    const exists = await this.findOne({userId,groupId});

    if(exists){
        throw Error('العنصر موجود في العربة بالفعل!')
    }

    const { name,price,periods,groupChatIds,lifeTimePrice,isLifeTime,groupImageUrl,isLocked,description } = await groupsModel.findOne({_id:groupId})

    const newItem = await this.create({userId,groupId,period})

    if(isLifeTime){
        return {...newItem._doc,name,price,periods,period,
            periodName:'مدى الحياة',
            periodPrice:lifeTimePrice,
            isLifeTime,groupImageUrl,isLocked,description,groupChatIds
        }
    }else {
        return {...newItem._doc,name,price,periods,period,
            periodName:periods[period].periodName,
            periodPrice:periods[period].periodPrice,
            periodInDays:periods[period].periodInDays,
            isLifeTime,groupImageUrl,isLocked,description,groupChatIds
        }
    }
}

cartSchema.statics.changePeriod = async function(userId,groupId,newPeriod) {
    const exists = await this.findOne({userId,groupId});

    if(!exists){
        throw Error('العنصر غير موجود ')
    }

    const updatedItem = await this.findOneAndUpdate({_id:exists._id},{period:newPeriod})
    const { name,groupChatIds,price,periods,isLifeTime,groupImageUrl,isLocked,description } = await groupsModel.findOne({_id:groupId})

    if(isLifeTime){
        return {...updatedItem._doc,name,price,periods,period:newPeriod,
            periodName:'مدى الحياة',
            periodPrice:lifeTimePrice,
            isLifeTime,groupImageUrl,isLocked,description,groupChatIds
        }
    }else {
        return {...updatedItem._doc,name,price,periods,period:newPeriod,
            periodName:periods[newPeriod].periodName,
            periodPrice:periods[newPeriod].periodPrice,
            periodInDays:periods[newPeriod].periodInDays,
            isLifeTime,groupImageUrl,isLocked,description,groupChatIds
        }
    }
}

cartSchema.statics.removeItem = async function(groupId,period) {
    const exists = await this.findOne({groupId,period});

    
    if(!exists){
        throw Error('العنصر غير موجود بالفعل')
    }
    
    const deletedItem = await this.findOneAndDelete({groupId,period})

    return deletedItem
}

cartSchema.statics.clearCart = async function(userId) {
    const deletedItems = await this.deleteMany({userId});

    return deletedItems
}

cartSchema.statics.getUserCartItems = async function(userId) {
    const itemsIds = await this.find({userId});

    let allItems = {}
    const fetchedItems = await groupsModel.find();
    fetchedItems.forEach(e=>{
        const {_id,name,groupChatIds,lifeTimePrice,periods,isLifeTime,groupImageUrl,isLocked,description} = e
        allItems[_id] = {name,groupChatIds,lifeTimePrice,periods,isLifeTime,groupImageUrl,isLocked,description}
    })

    const result = itemsIds.map(e=>{
        if(allItems[e.groupId].isLifeTime){
            return {
                _id:e._id,
                groupId:e.groupId,
                period:e.period,
                groupChatIds:e.groupChatIds,
                periodName:'مدى الحياة',
                periodPrice:allItems[e.groupId].lifeTimePrice,
                ...allItems[e.groupId]
            }
        }else {
            return {
                _id:e._id,
                groupId:e.groupId,
                period:e.period,
                groupChatIds:e.groupChatIds,
                periodName:allItems[e.groupId].periods[e.period].periodName,
                periodPrice:allItems[e.groupId].periods[e.period].periodPrice,
                periodInDays:allItems[e.groupId].periods[e.period].periodInDays,
                ...allItems[e.groupId]
            }
        }
    })

    return result
}

module.exports = mongoose.model('cart',cartSchema)