const express = require('express');
const router = express.Router();
const PressController = require('../controllers/press.controller')


router.post('/create', PressController.create)

router.get('/test', (req, res) => {
    res.json("data")
})

module.exports = router