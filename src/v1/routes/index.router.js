const express = require('express');
const router = express.Router();
const writerRouter = require('./writer.router');
const pressRouter = require('./press.router');
const {upload, uploadResponse} = require('../middlewares/upload.middleware');
const path = require('path');

router.use('/v1/api/writer', writerRouter)
router.use('/v1/api/press', pressRouter)
router.use('/v1/api/upload', upload.single('file'), uploadResponse);

router.post('/test', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'api ok',
    })
})

module.exports = router;