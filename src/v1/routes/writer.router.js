const express = require('express');
const router = express.Router();
const WriterController = require('../controllers/writer.controller')
const {verifyAccessToken} = require('../utils/jwt')
const {authValidate} = require('../middlewares/validate.middleware')
const {checkBlackList, createNewToken} = require('../middlewares/jwt.middleware')

router.post('/create', authValidate, WriterController.create)
router.post('/login', WriterController.login)
router.post('/refreshToken', checkBlackList, createNewToken)

router.get('/test', verifyAccessToken, (req, res) => {
    res.json("data")
})

module.exports = router