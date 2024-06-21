const adminModel = require('../../models/admin')
const teleAdmin = require('../../models/teleAdmin')
const addressModel = require('../../models/address')
const saveImageToAWS = require('../../functions/base64toAWS')

const createAdmin = async (req,res) => {
    const { username,password,access } = req.body
    try {
        const admin = await adminModel.createAdmin(username,password,access)
        res.status(200).json(admin)
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const deleteAdmin = async (req,res) => {
    const { _id } = req.body
    try {

        const admin = await adminModel.deleteAdmin(_id)
        res.status(200).json(admin)
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const editAccess = async (req,res) => {
    const { _id,access } = req.body

    try {
        const admin = await adminModel.editAccess(_id,access)
        res.status(200).json(admin)
    }catch(err){
        res.status(400).json({message:json.message})
    }
}

const changePassword = async (req,res) => {
    const { _id,password } = req.body
    try {
        const admin = await adminModel.changePassword(_id,password)
        res.status(200).json(admin)
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const getAllAdmins = async (req,res) => {
    try {
        const admins = await adminModel.getAllAdmins()
        res.status(200).json(admins)
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const getTeleAdmin = async (req,res) => {
    try {
        const telegramAdmin = await teleAdmin.getTeleAdmin()
        
        res.status(200).json({telegramAdmin})
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const updateTeleAdmin = async (req,res) => {
    const { newId } = req.body

    try {
        const telegramAdmin = await teleAdmin.update(newId)

        res.status(200).json({telegramAdmin})
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const getAddress = async (req,res) => {
    try {
        const address = await addressModel.getAddress()
        
        res.status(200).json({address})
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const updateAddress = async (req,res) => {
    const { newWalletId,newQrCode } = req.body

    try {
        let base64Pattern = /^data:image\/(png|jpeg|jpg|gif);base64,/i;
        let testedQrCode = null

        if(base64Pattern.test(newQrCode)){
            testedQrCode = await saveImageToAWS(newQrCode)
        }else {
            testedQrCode = newQrCode
        }

        const address = await addressModel.update(newWalletId,testedQrCode)

        res.status(200).json({address})
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

module.exports = {
    createAdmin,
    deleteAdmin,
    editAccess,
    changePassword,
    getAllAdmins,
    getTeleAdmin,
    updateTeleAdmin,
    getAddress,
    updateAddress
}