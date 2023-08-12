const express = require('express');
const router = express.Router();
const writerRouter = require('./writer.router');
const pressRouter = require('./press.router');
const {upload, uploadResponse} = require('../middlewares/upload.middleware');
const path = require('path');

router.use('/api/v1/writer', writerRouter)
router.use('/api/v1/press', pressRouter)
router.post('/api/v1/upload', upload.single('file'), uploadResponse);

router.get('/api', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'api ok',
    })
})

module.exports = router;