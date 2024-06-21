const groubModel = require('../../models/groups');
const profitModel = require('../../models/profits');
const requestModel = require('../../models/requests');
const subscriptionModel = require('../../models/subscriptions');
const usersModel = require('../../models/users');

const getHomeDetails = async (req,res) => {
    const { access } = req.admin
    let data = {allGroubs:null,profits:null,requests:null,subs:null,users:null}
    try {
        if(access.includes('groups') || access.includes('owner')){
            data.allGroubs = await groubModel.count()
        }
        if(access.includes('profits') || access.includes('owner')){
            data.profits = await profitModel.getStatistics()
        }
        if(access.includes('requests') || access.includes('owner')){
            data.requests = await requestModel.find({state:'pending'}).count()
        }
        if(access.includes('subs') || access.includes('owner')){
            data.subs = await subscriptionModel.find({isEnded:false}).count()
        }
        if(access.includes('users') || access.includes('owner')){
            data.users = await usersModel.count()
        }

        res.status(200).json(data)
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    getHomeDetails
}