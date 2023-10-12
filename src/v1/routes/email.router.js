const express = require('express');
const router = express.Router();
const EmailController = require('../controllers/email.controller')
const {EmailValidate} = require('../middlewares/validate.middleware');
const {verifyToken} = require('../middlewares/jwt.middleware')


router.post('/add', EmailValidate, EmailController.add)

router.get('/test', (req, res) => {
    res.json("data")
})

module.exports = router