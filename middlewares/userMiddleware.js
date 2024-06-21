const userModel = require('../models/users');
const JWT = require('jsonwebtoken');


const userMiddleware = async (req,res,next)=>{
    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({error:'لم تتم عملية التحقق بنجاح'});
    }

    try {
        const token = authorization.split(' ')[1];
        const {_id} = JWT.verify(token,process.env.SECRET)
        const user = await userModel.findOne({_id});

        if(!user){
            return res.status(401).json({error:'فشل في عملية التحقق'});
        }

        req.user = user
        next()
    }catch (err){
        return res.status(401).json({error:err.message});
    }
}

module.exports = userMiddleware