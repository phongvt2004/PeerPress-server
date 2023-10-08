const express = require('express');
const router = express.Router();
const writerRouter = require('./writer.router');
const pressRouter = require('./press.router');
const consultRouter = require('./consult.router');
const emailRouter = require('./email.router');
const {upload, uploadResponse} = require('../middlewares/upload.middleware');
const {verifyToken} = require('../middlewares/jwt.middleware')
const path = require('path');

router.use('/v1/writer', writerRouter)
router.use('/v1/press', pressRouter)
router.use('/v1/consult', consultRouter)
router.use('/v1/email', emailRouter)
router.post('/v1/upload', verifyToken, upload.single('file'), uploadResponse);

router.get('/test', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'api ok',
    })
})

module.exports = router;