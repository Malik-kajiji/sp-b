const express = require('express')
const router = express.Router()
const userMiddleware = require('../../middlewares/userMiddleware')

const {
    addItem,
    changePeriod,
    removeItem,
    clearCart,
    getUserCartItems,
    placeOrder,
    rePlaceOrder,
    getOrder
} = require('../../controllers/userControllers/cartController')

router.put('/re-place-order',rePlaceOrder)
router.get('/get-order/:_id',getOrder)
router.use(userMiddleware)
router.post('/add-item',addItem)
router.put('/update-item',changePeriod)
router.delete('/remove-item',removeItem)
router.delete('/clear-cart',clearCart)
router.get('/get-user-cart',getUserCartItems)
router.post('/place-order',placeOrder)

module.exports = router