const express = require('express');
const router = express.Router();
const writerRouter = require('./writer.router');
const pressRouter = require('./press.router');
const {upload} = require('../middlewares/upload.middleware');
const path = require('path');

router.use('/v1/api/writer', writerRouter)
router.use('/v1/api/press', pressRouter)

router.post('/test', upload.single('file'), (req, res, next) => {
    console.log(req.file)
    res.status(200).json({
        status: 'success',
        message: 'api ok',
        filePath: req.file.path.replace(path.join(__dirname, '../'), '')
    })
})

module.exports = router;