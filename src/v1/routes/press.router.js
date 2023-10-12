const express = require('express');
const router = express.Router();
const PressController = require('../controllers/press.controller')
const {verifyToken} = require('../middlewares/jwt.middleware')


router.post('/create', verifyToken, PressController.create)
router.put('/update', verifyToken,PressController.update)
router.patch('/update', PressController.updateData)
router.get('/get/id', PressController.get)
router.get('/get/type', PressController.getByType)
router.get('/get/slug', PressController.getBySlug)
router.get('/get/newpost', PressController.getNewPost)
router.get('/get/popular', PressController.getPopularPost)
router.get('/search', PressController.searchPress)
router.delete('/delete', verifyToken, PressController.deletePress)
router.delete('/deleteForever', verifyToken, PressController.deletePress)

router.get('/test', (req, res) => {
    res.json("data")
})

module.exports = router