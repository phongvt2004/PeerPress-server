const express = require('express');
const router = express.Router();
const PressController = require('../controllers/press.controller')


router.get('/test', (req, res) => {
    res.json("data")
})

router.post('/test/post', (req, res) => {
    res.json("data")
})


module.exports = router