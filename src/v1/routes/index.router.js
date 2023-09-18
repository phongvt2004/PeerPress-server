const express = require('express');
const router = express.Router();
const writerRouter = require('./writer.router');
const pressRouter = require('./press.router');
const consultRouter = require('./consult.router');
const {upload, uploadResponse} = require('../middlewares/upload.middleware');
const path = require('path');

router.use('/v1/writer', writerRouter)
router.use('/v1/press', pressRouter)
// router.use('/v1/consult', consultRouter)
router.post('/v1/upload', upload.single('file'), uploadResponse);

router.get('/test', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'api ok',
    })
})

module.exports = router;