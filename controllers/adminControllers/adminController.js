const adminController = require('../../models/admin')
const JWT = require('jsonwebtoken');

const createToken =  (_id)=>{
    return JWT.sign({_id},process.env.SECRET,{expiresIn:'30d'})
}

const loginAsAdmin = async (req,res) => {
    const { username,password } = req.body
    try {
        if(username === '' || password === ''){
            res.status(400).json({message:'الرجاء ملئ الحقول'})
        }
        const admin = await adminController.loginAsAdmin(username,password)
        const token = createToken(admin._id)
        res.status(200).json({
            username:admin.username,
            access:admin.access,
            token
        })
    }catch(err){
        res.status(400).json({message:err.message});
    }
}


module.exports = {
    loginAsAdmin,
}