const groupsModel = require('../../models/groups')
const addressModel = require('../../models/address')

const getAllGroups = async (req,res) => {
    try {
        const allGroubs = await groupsModel.getAllGroups()
        res.status(200).json({
            allGroubs
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getSingleGroup = async (req,res) => {
    const { group_id } = req.params
    try {
        const groub = await groupsModel.getSingleGroup(group_id)
        res.status(200).json({
            groub
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getAddress = async (req,res) => {
    try {
        const address = await addressModel.getAddress()
        res.status(200).json({address})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    getAllGroups,
    getSingleGroup,
    getAddress
}