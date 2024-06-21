const express = require('express')
const router = express.Router()

const {
    getAllGroups,
    getSingleGroup,
    getAddress
} = require('../../controllers/userControllers/homePageController')

router.get('/get-all-groups',getAllGroups)
router.get('/get-single-group/:group_id',getSingleGroup)
router.get('/get-address',getAddress)


module.exports = router