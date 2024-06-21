const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middlewares/adminMiddleware')

const {
    getAllGroups,
    getSingleGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    updateIsLocked
} = require('../../controllers/adminControllers/groupsController')

router.use(async (req,res,next)=>{await adminMiddleware(req,res,next,'groups')})
router.get('/get-all-groups',getAllGroups)
router.get('/get-single-group/:group_id',getSingleGroup)
router.post('/create-group',createGroup)
router.put('/update-group',updateGroup)
router.delete('/delete-group',deleteGroup)
router.put('/update-is-locked',updateIsLocked)

module.exports = router