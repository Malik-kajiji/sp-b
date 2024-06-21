const JWT = require('jsonwebtoken');


const ownerMiddleware = async (req,res,next)=>{
    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({error:'لم تتم عملية التحقق بنجاح'});
    }

    try {
        const token = authorization.split(' ')[1];
        const {_id} = JWT.verify(token,process.env.SECRET)
        if(_id !== process.env.OWNER_ID) {
            throw Error('لم تتم عملية التحقق بنجاح')
        }
        next()
    }catch (err){
        return res.status(401).json({error:err.message});
    }
}

module.exports = ownerMiddleware