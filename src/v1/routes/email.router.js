const express = require('express');
const router = express.Router();
const EmailController = require('../controllers/email.controller')
const {verifyToken} = require('../middlewares/jwt.middleware')


router.post('/add', EmailController.create)

router.get('/test', (req, res) => {
    res.json("data")
})

module.exports = router