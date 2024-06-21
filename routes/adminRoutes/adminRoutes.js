const express = require('express')
const router = express.Router()

const {
    loginAsAdmin,
} = require('../../controllers/adminControllers/adminController')

router.post('/login',loginAsAdmin)

module.exports = router