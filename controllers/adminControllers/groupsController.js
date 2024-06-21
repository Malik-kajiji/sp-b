const groupModel = require('../../models/groups')
const saveImageToAWS = require('../../functions/base64toAWS')

const getAllGroups = async (req,res) => {
    try {
        const allGroups = await groupModel.getAllGroups()

        res.status(200).json({allGroups})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getSingleGroup = async (req,res) => {
    const { group_id } = req.params;
    try {
        const group = await groupModel.getSingleGroup(group_id)

        res.status(200).json({group})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const createGroup = async (req,res) => {
    const { name,groupChatIds,periods,isLifeTime,lifeTimePrice,lifeTimeDesc,description,features,groupImageBase64,groupIconBase64 } = req.body

    try {
        const groupImageUrl = await saveImageToAWS(groupImageBase64)
        const groupIconUrl = await saveImageToAWS(groupIconBase64)

        const group = await groupModel.createGroup(name,groupChatIds,periods,isLifeTime,lifeTimePrice,lifeTimeDesc,description,features,groupImageUrl,groupIconUrl)

        res.status(200).json({group})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const updateGroup = async (req,res) => {
    const { _id,name,groupChatIds,price,periods,isLifeTime,lifeTimePrice,lifeTimeDesc,description,features,groupImageBase64,groupIconBase64 } = req.body

    try {
        let base64Pattern = /^data:image\/(png|jpeg|jpg|gif);base64,/i;
        let testedImage = null
        let testedIcon = null

        if(base64Pattern.test(groupImageBase64)){
            testedImage = await saveImageToAWS(groupImageBase64)
        }else {
            testedImage = groupImageBase64
        }

        if(base64Pattern.test(groupIconBase64)){
            testedIcon = await saveImageToAWS(groupIconBase64)
        }else {
            testedIcon = groupIconBase64
        }

        const group = await groupModel.updateGroup(_id,name,groupChatIds,price,periods,isLifeTime,lifeTimePrice,lifeTimeDesc,description,features,testedImage,testedIcon)
        res.status(200).json({group})

    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const deleteGroup = async (req,res) => {
    const { _id } = req.body

    try {
        const group = await groupModel.deleteGroup(_id)

        res.status(200).json({group})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const updateIsLocked = async (req,res) => {
    const { _id,isLocked } = req.body

    try {
        const group = await groupModel.updateIsLocked(_id,isLocked)

        res.status(200).json({group})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    getAllGroups,
    getSingleGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    updateIsLocked
}