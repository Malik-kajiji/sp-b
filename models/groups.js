const mongoose = require('mongoose');

const schema = mongoose.Schema

const groupSchema = new schema({
    name: {
        type:String,
        required:true,
        unique:true
    },
    groupChatIds: {
        type:Array,
        default:[],
        required:true,
    },
    periods: {
        type:Array,
        required:true,
    },
    isLifeTime: {
        type:Boolean,
        default:false,
        required:true
    },
    lifeTimePrice: {
        type:Number,
    },
    lifeTimeDesc: {
        type:String,
    },
    description: {
        type:String,
        default:'',
        required:true,
    },
    features: {
        type:Array,
        default:[],
        required:true
    },
    groupImageUrl: {
        type:String,
        required:true,
    },
    groupIconUrl: {
        type:String,
        required:true,
    },
    isLocked: {
        type:Boolean,
        default:false,
        required:true
    }
})

groupSchema.statics.createGroup = async function(name,groupChatIds,periods,isLifeTime,lifeTimePrice,lifeTimeDesc,description,features,groupImageUrl,groupIconUrl) {
    const exists = await this.findOne({name});
    if(exists){
        throw Error('القروب موجود بالفعل')
    }else {
        const group = await this.create({name,groupChatIds,periods,isLifeTime,lifeTimePrice,lifeTimeDesc,description,features,groupImageUrl,groupIconUrl})

        return group
    }
}

groupSchema.statics.updateGroup = async function(_id,name,groupChatIds,price,periods,isLifeTime,lifeTimePrice,lifeTimeDesc,description,features,groupImageUrl,groupIconUrl) {
    const exists = await this.findOne({_id});
    if(!exists){
        throw Error('القروب غير موجود')
    }else {
        const group = await this.findOneAndUpdate({_id},{name,groupChatIds,price,periods,isLifeTime,lifeTimePrice,lifeTimeDesc,description,features,groupImageUrl,groupIconUrl})

        return {...group._doc,name,groupChatIds,price,periods,isLifeTime,lifeTimePrice,lifeTimeDesc,description,groupImageUrl,groupIconUrl}
    }
}

groupSchema.statics.deleteGroup = async function(_id) {
    const exists = await this.findOne({_id});
    if(!exists){
        throw Error('القروب غير موجود')
    }else {
        const group = await this.findOneAndDelete({_id})

        return group
    }
}

groupSchema.statics.getAllGroups = async function() {
    const groups = await this.find()
    
    return groups
}

groupSchema.statics.getSingleGroup = async function(_id) {
    const groups = await this.findOne({_id})
    
    return groups
}

groupSchema.statics.updateIsLocked = async function(_id,isLocked) {
    const group = await this.findOneAndUpdate({_id},{isLocked})
    
    return {...group._doc,isLocked}
}

module.exports = mongoose.model('group',groupSchema)