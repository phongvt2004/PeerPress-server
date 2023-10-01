const express = require('express');
const router = express.Router();
const WriterController = require('../controllers/writer.controller')
const {verifyAccessToken} = require('../utils/jwt')
const {authValidate} = require('../middlewares/validate.middleware')
const {checkBlackList, createNewToken, verifyToken} = require('../middlewares/jwt.middleware')

router.post('/create', WriterController.create)
router.post('/login', WriterController.login)
router.post('/refreshToken', createNewToken)

router.get('/test', verifyToken, (req, res) => {
    console.log(req?.cookies)
    res.json("data")
})

module.exports = router