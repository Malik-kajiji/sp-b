const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middlewares/adminMiddleware')

const {
    getHomeDetails
} = require('../../controllers/adminControllers/homePageController')

router.use(async (req,res,next)=>{await adminMiddleware(req,res,next,'home')})
router.get('/get-details',getHomeDetails)

module.exports = router