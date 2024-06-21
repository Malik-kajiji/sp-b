const express = require('express')
const router = express.Router()
const userMiddleware = require('../../middlewares/userMiddleware')

const {
    createUser,
    userLogin,
    sendResetPassLink,
    resetPass,
    isUserVerified,
    getUserData
} = require('../../controllers/userControllers/accountController')

router.post('/signup',createUser)
router.post('/login',userLogin)
router.post('/send-reset-link',sendResetPassLink)
router.put('/reset-password',resetPass)
router.use(userMiddleware)
router.get('/is-user-verified',isUserVerified)
router.get('/get-data',getUserData)

module.exports = router