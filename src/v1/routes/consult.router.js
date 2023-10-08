const express = require('express');
const router = express.Router();
const ConsultController = require('../controllers/consult.controller')
const {verifyToken} = require('../middlewares/jwt.middleware')


router.post('/create', ConsultController.create)
router.get('/get/id', verifyToken, ConsultController.get)
router.get('/get/list', verifyToken, ConsultController.getList)

router.get('/test', (req, res) => {
    res.json("data")
})

module.exports = router