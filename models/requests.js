const mongoose = require('mongoose');

const schema = mongoose.Schema

const requestSchema = new schema({
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
    groupsIds: {
        type:Array,
        required:true
    },
    totalPrice: {
        type:Number,
        required:true,
    },
    walletId: {
        type:String,
        required:true
    },
    state: {
        type:String,
        enum:['pending','accepted','rejected','payment-issue'],
        required:true,
        default:'pending'
    },
    isSecoundTime: {
        type:Boolean,
        default:false
    },
    firstPayment: {
        type:Number,
        default:0
    }
},{timestamps:true})

requestSchema.statics.placeOrder = async function(userId,userName,phoneNumber,groupsIds,totalPrice,walletId) {
    const newOrder = await this.create({userId,userName,phoneNumber,groupsIds,totalPrice,walletId});

    return newOrder
}

requestSchema.statics.rePlaceOrder = async function(_id,walletId) {
    const newOrder = await this.findOneAndUpdate({_id},{walletId,state:'pending'});

    return newOrder
}

requestSchema.statics.getPendingOrders = async function() {
    const pendingOrders = await this.find({state:'pending'});

    return pendingOrders
}

requestSchema.statics.acceptOrder = async function(_id) {
    const newOrder = await this.findOneAndUpdate({_id},{state:'accepted'});

    return newOrder
}

requestSchema.statics.rejectOrder = async function(_id) {
    const newOrder = await this.findOneAndUpdate({_id},{state:'rejected'});

    return newOrder
}

requestSchema.statics.notPaidOrder = async function(_id,paid) {
    const newOrder = await this.findOneAndUpdate({_id},{state:'payment-issue',firstPayment:paid,isSecoundTime:true});

    return newOrder
}

module.exports = mongoose.model('request',requestSchema)