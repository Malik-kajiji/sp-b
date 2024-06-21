const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middlewares/adminMiddleware')

const {
    getAllMonths,
    getSingleMonth
} = require('../../controllers/adminControllers/profitsController')

router.use(async (req,res,next)=>{await adminMiddleware(req,res,next,'profits')})
router.get('/get-all-months',getAllMonths)
router.get('/get-single-month/:month_id',getSingleMonth)

module.exports = router