const express = require('express');
const router = express.Router();
const PressController = require('../controllers/press.controller')


router.post('/create', PressController.create)
router.get('/get/id', PressController.get)
router.get('/get/type', PressController.getByType)
router.get('/get/slug', PressController.getBySlug)
router.get('/get/newpost', PressController.getNewPost)
router.get('/search', PressController.searchPress)

router.get('/test', (req, res) => {
    res.json("data")
})

module.exports = router