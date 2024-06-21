const userModel = require('../../models/users')

const getUsers = async (req,res) => {
    const { page_count } = req.params
    try {
        const users = await userModel.getUsers(page_count)
        const usersCount = await userModel.count();
        const pagesCount  = Math.ceil(usersCount / 100)

        res.status(200).json({users,pagesCount})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getSingleUser = async (req,res) => {
    const { phone_number } = req.params
    try {
        const user = await userModel.getSingleUser(phone_number)
        const usersCount = await userModel.count();
        const pagesCount  = Math.ceil(usersCount / 100)
        
        res.status(200).json({user,pagesCount})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const bannedUser = async (req,res) => {
    const { _id } = req.body
    try {
        const user = await userModel.bannedUser(_id)

        res.status(200).json({user})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const unBannedUser = async (req,res) => {
    const { _id } = req.body
    try {
        const user = await userModel.unBannedUser(_id)

        res.status(200).json({user})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}


module.exports = {
    getUsers,
    getSingleUser,
    bannedUser,
    unBannedUser
}