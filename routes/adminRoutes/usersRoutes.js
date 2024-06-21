const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middlewares/adminMiddleware')

const {
    getUsers,
    getSingleUser,
    bannedUser,
    unBannedUser
} = require('../../controllers/adminControllers/usersController')

router.use(async (req,res,next)=>{await adminMiddleware(req,res,next,'users')})
router.get('/get-users/:page_count',getUsers)
router.get('/get-single-user/:phone_number',getSingleUser)
router.put('/banned-user',bannedUser)
router.put('/unbanned-user',unBannedUser)

module.exports = router