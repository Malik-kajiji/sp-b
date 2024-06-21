const express = require('express')
const router = express.Router()
const ownerMiddleware = require('../../middlewares/ownerMiddleware')

const {
    createAdmin,
    deleteAdmin,
    editAccess,
    changePassword,
    getAllAdmins,
    getTeleAdmin,
    updateTeleAdmin,
    getAddress,
    updateAddress
} = require('../../controllers/ownerControllers/ownerAdminController')

router.use(ownerMiddleware)
router.post('/create',createAdmin)
router.delete('/delete',deleteAdmin)
router.put('/edit',editAccess)
router.put('/change-password',changePassword)
router.get('/get-all',getAllAdmins)
router.get('/get-tele-admin',getTeleAdmin)
router.post('/update-tele-admin',updateTeleAdmin)
router.get('/get-address',getAddress)
router.post('/update-address',updateAddress)

module.exports = router