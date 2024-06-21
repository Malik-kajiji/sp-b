const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middlewares/adminMiddleware')

const {
    getPendingOrders,
    acceptOrder,
    rejectOrder,
    notCompletedPayment
} = require('../../controllers/adminControllers/requestsController')

router.use(async (req,res,next)=>{await adminMiddleware(req,res,next,'requests')})
router.get('/get-orders',getPendingOrders)
router.put('/accept',acceptOrder)
router.put('/reject',rejectOrder)
router.put('/payment-issue',notCompletedPayment)

module.exports = router