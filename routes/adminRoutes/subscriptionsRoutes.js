const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middlewares/adminMiddleware')

const {
    getCurrentSubs,
    getSubsForUser,
    endSub
} = require('../../controllers/adminControllers/subscriptionController')

router.use(async (req,res,next)=>{await adminMiddleware(req,res,next,'subs')})
router.get('/get-current-subs/:page_count',getCurrentSubs)
router.get('/get-subs-for-user/:phone_number',getSubsForUser)
router.put('/end-sub',endSub)

module.exports = router