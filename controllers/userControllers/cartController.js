const cartModel = require('../../models/cart')
const requestModel = require('../../models/requests')
const { orderNotification } = require('../../functions/telegramBot')

const addItem = async (req,res) => {
    const { groupId,periodIndex } = req.body
    const { _id } = req.user
    try {
        const newItem = await cartModel.addItem(_id,groupId,periodIndex)
        res.status(200).json({
            newItem
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const changePeriod = async (req,res) => {
    const { groupId,periodIndex } = req.body
    const { _id } = req.user
    try {
        const updatedItem = await cartModel.changePeriod(_id,groupId,periodIndex)
        res.status(200).json({
            updatedItem
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const removeItem = async (req,res) => {
    const { groupId,periodIndex } = req.body
    
    try {
        const deletedItem = await cartModel.removeItem(groupId,periodIndex)

        res.status(200).json({
            deletedItem
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const clearCart = async (req,res) => {
    const { _id } = req.user

    try {
        const deletedItems = await cartModel.clearCart(_id)
        res.status(200).json({
            deletedItems
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getUserCartItems = async (req,res) => {
    const { _id } = req.user

    try {
        const cartItems = await cartModel.getUserCartItems(_id)
        res.status(200).json({
            cartItems
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const placeOrder = async (req,res) => {
    const { _id,userName,phoneNumber } = req.user;
    const { addedItems,totalPrice,walletId } = req.body;

    try {
        const deletedItem = await requestModel.placeOrder(_id,userName,phoneNumber,addedItems,totalPrice,walletId)
        await cartModel.clearCart(_id)
        await orderNotification()
        res.status(200).json({
            deletedItem
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const rePlaceOrder = async (req,res) => {
    const { _id,walletId } = req.body;

    try {
        const deletedItem = await requestModel.rePlaceOrder(_id,walletId)
        await orderNotification()
        res.status(200).json({
            deletedItem
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getOrder = async (req,res) => {
    const { _id } = req.params;

    try {
        const order = await requestModel.findById(_id)
        res.status(200).json({
            order
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    addItem,
    changePeriod,
    removeItem,
    clearCart,
    getUserCartItems,
    placeOrder,
    rePlaceOrder,
    getOrder
}